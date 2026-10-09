export const scenarios = [
 {id:"SYN-SDV-001", label:"Traceable participant evidence", expected:"SYN-PERSON-A", text:"Participant SYN-PERSON-A: enquiry received; reply present.", candidates:[{label:"SYN-PERSON-A",role:"participant"}], mode:"chat", enquiry:true, reply:true, duration:0, consentCovered:true},
 {id:"SYN-SDV-002", label:"Positive system call duration", expected:"SYN-PERSON-B", text:"Participant SYN-PERSON-B: system call record.", candidates:[{label:"SYN-PERSON-B",role:"participant"}], mode:"phone", enquiry:false, reply:false, duration:90, consentCovered:true},
 {id:"SYN-SDV-003", label:"Missing call evidence", expected:"SYN-PERSON-C", text:"Participant SYN-PERSON-C: follow-up record.", candidates:[{label:"SYN-PERSON-C",role:"participant"}], mode:"phone", enquiry:false, reply:false, duration:0, consentCovered:true},
 {id:"SYN-SDV-004", label:"Guardian is not participant identity", expected:"SYN-PERSON-D", text:"Guardian SYN-PERSON-D replied to the enquiry.", candidates:[{label:"SYN-PERSON-D",role:"guardian"}], mode:"chat", enquiry:true, reply:true, duration:0, consentCovered:true},
 {id:"SYN-SDV-005", label:"Consent form not covered", expected:"SYN-PERSON-E", text:"Participant SYN-PERSON-E: enquiry received; reply present.", candidates:[{label:"SYN-PERSON-E",role:"participant"}], mode:"chat", enquiry:true, reply:true, duration:0, consentCovered:false},
 {id:"SYN-SDV-006", label:"Untraceable extracted candidate", expected:"SYN-PERSON-F", text:"Fictional image contains no participant label.", candidates:[{label:"SYN-PERSON-F",role:"participant"}], mode:"chat", enquiry:true, reply:true, duration:0, consentCovered:true}
];
export function evaluate(record){
 const reasons=[]; const notes=[];
 const traceable=(record.candidates||[]).filter(x=>x.role==="participant" && typeof x.label==="string" && x.label.length>0 && record.text.includes(x.label));
 if(!traceable.some(x=>x.label===record.expected)) reasons.push("identity_unconfirmed");
 if(record.mode==="phone"){
  if(!Number.isFinite(record.duration) || record.duration<=0) reasons.push("call_evidence_missing");
  else notes.push("positive_system_duration");
 } else if(record.mode==="chat"){
  if(!record.enquiry || !record.reply) reasons.push("chat_chain_incomplete");
 } else reasons.push("unsupported_mode");
 if(!record.consentCovered) notes.push("consent_not_covered");
 return {status:reasons.length?"inconsistent":"consistent",manualReview:reasons.length>0,reasons,notes,traceable};
}
