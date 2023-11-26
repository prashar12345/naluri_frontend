import React from "react"

const ContentModal = ({ form, modalClosed }) => {
    return <>
        <div className="modal fade" id="contentModal" data-backdrop="static" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog  modal-dialog-md" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title top_hedding" id="exampleModalLabel">CONSULTATION SERVICES INFORMED CONSENT</h5>
                        {/* <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button> */}
                    </div>
                    <div className="modal-body">
                        <h3 className="semi_hedding">Informed Consent Form </h3>

                        <p className="mb-2">The purpose of this form is to share some important principles, which guide the consultation process so that the client can make informed decisions to proceed in working together with the consultant based on accurate, informed expectations.</p>

                        <p className="mb-2"> takes our service delivery and the confidentiality of our client's personal information seriously in an effort to make sure that they are aligned with the Health Insurance Portability and Accountability Act of 1996 (HIPAA) standards. Please read this carefully and feel free to ask any questions about what you have read or to have further clarification from our consultation team. </p>

                        <p className="mb-2">Informed consent is the clients' full and active participation in making decisions that will affect them and their freedom of choice based on the information shared. It is a continuous process throughout the consultation relationship. The client has the right to refuse and/or withdraw from the consultation at any time without having to bear any consequences. </p>


                        <h3 className="semi_hedding">Psychological and Counseling Therapy Services </h3>

                        <p className="mb-2">Therapy is not always easily described. Therapy is a process of personal exploration and may lead to major changes in one's life perspectives and decisions. It varies depending on the approaches used, the personalities of the consultant and the client and the particular problems brought to each session(s). Consultation calls for a very active effort from both parties in order for the therapy to be successful, the client will have to work on things talked about both during the session(s) and at home.</p>

                        <p className="mb-2">Therapy can have benefits and risks. Since therapy often involves discussing unpleasant aspects of our life, the client may experience uncomfortable feelings like sadness, guilt, anger, frustration, loneliness and helplessness. On the other hand, therapy service has been shown to have benefits for people who go through it. Therapy can lead to better relationships, learning new ways to cope with or solve problems, developing new skills, a significant reduction in feelings of distress, changing unwanted behaviors, and improved self-esteem. There are no guarantees of what the client may experience, however, closure and reassurance will be implemented to ensure the session ends smoothly. Together we will work to achieve the best possible results for you. </p>

                        <h3 className="semi_hedding">Dietitian Consultation Services </h3>

                        <p className="mb-2">Dietitians do not provide medical advice nor prescribe treatment. Rather, he/she provides education to enhance clients' knowledge on health-related aspects: food and nutrition, dietary supplements, and behaviors associated with eating. </p>

                        <p className="mb-2">Methods of nutritional evaluation or testing made available to the client are not intended to diagnose disease. Rather, these assessments are intended as a guide to enhance the client's nutritional health and support the achievement of the client's health goals. While nutritional support can be an important complement to medical care and mental health, nutrition counseling is not a substitute for diagnosis, treatment or care of disease by a medical provider. </p>

                        <h3 className="semi_hedding">Career Coaching Services </h3>

                        <p className="mb-2">Career Coaching is a service provided to tackle both professional and personal development. Through coaching, issues affecting the client's performance at the workplace or in life can be addressed, helping to arrive at improvements and career goals. </p>

                        <p className="mb-2">Executive coaching is defined as a supporting relationship formed between the Coach and Coachee which involves a series of one-on-one interactions. A wide variety of behavioral techniques and methods are used such as observation, questioning, listening and feedback to create a conversation that's rich in insight and learning. The goal of these conversations is to equip the Coachee with the knowledge and opportunities they need to develop and improve their professional performance and personal satisfaction hence becoming more effective in their roles.</p>

                        <h3 className="semi_hedding">Fitness Coaching Services</h3>

                        <p className="mb-2">A fitness coach's goals are to help members develop a healthy lifestyle first and foremost, help empower members with the ability to maintain a healthy lifestyle and if requested by members, to improve performance
                            in a specific activity or sport.
                        </p>

                        <p className="mb-2">Fitness coaches will be able to do two things, first is that they can have regular calls with the members to help coach members if they have a fitness program either they acquired or the coaches themselves created for them. But this will depend on the plan set by both the member and the coach as a few processes will need to happen if it is a regular thing (i.e., intake assessment, time commitment). Secondly, the coaches can have a short follow-up or a one-off call to help members with form checking, answering questions that the members might have regarding anything related to fitness, basic nutrition, and how to live a healthy lifestyle. </p>


                        <h3 className="semi_hedding">Medical Consultation Services</h3>

                        <p className="mb-2"> Medical consultation means conferring with and seeking assistance from a physician or other licensed healthcare professional for assessment and diagnostic conclusions, therapeutic interventions, or other services that will benefit the client. </p>

                        <p className="mb-2">It is a procedure whereby a healthcare provider reviews a patient's medical history, examines the patient and makes recommendations as to care and treatment. However, the COVID-19 pandemic has dramatically changed how patient care is delivered in healthcare practices, converting in-person visits to telemedicine visits. Hence, teleconsultations are a safe and effective way to assess and guide the patient's diagnosis and treatment remotely, where interactions happen between a clinician and a patient for the purpose of providing diagnostic or therapeutic advice through electronic means. </p>

                        <h3 className="semi_hedding">Confidentiality </h3>

                        <p className="mb-2">Information revealed by the client during consultation session(s) will be kept strictly confidential and will not be revealed to any other person or agency without the client's written permission, with the following exceptions: </p>

                        <ol>
                            <li className="mb-2"> Duty to Warn. If an individual intends to take harmful, dangerous, or criminal action against another
                                human being, or against himself or herself, it is our duty to warn appropriate individuals or agencies of such intentions. A consultant is required to breach confidentiality if the client poses an imminent threat to either themselves, the consultant, or a third party. Also, any actual or suspected acts of child, elder or disabled person abuse (including physical abuse, sexual abuse, unlawful sexual intercourse, neglect, emotional and psychological abuse) will need to be reported to the appropriate agencies by the consultants. The necessary information must be divulged to someone who is capable of taking action to reduce the threat.
                            </li>

                            <li className="mb-2">Court Subpoenas and administrative proceedings. When lawyers believe that a client's consultant
                                may have valuable information for their case, they will subpoena her/his notes, records, and in some instances, even the therapist themselves. In general, once a subpoena is served on a consultant, it must be obeyed or the consultant can be charged with contempt. </li>

                            <li className="mb-2">Consultation. Information about the client may be discussed in confidence, without revealing the
                                client's identity, with other consultation professionals and/or supervisors for the purpose of consultation and providing the clients with the best possible service.
                            </li>
                        </ol>

                        <h3 className="semi_hedding">Disclose of Personal Information </h3>

                        <p className="mb-2">Personal information includes psychotherapy notes, case notes, assessments, records, summaries and reports that are related to the client during the consultation session(s).  as an organization including consultants and all other staff are accountable to make sure that the client's personal information is kept confidential according to the Health Insurance Portability and Accountability Act of 1996 (HIPAA) standards.</p>

                        <p className="mb-2">In any circumstances that the client's personal information is required by the client, any person, agency or organization, the request should be supported with valid and relevant reasoning. The consultant has the right to decide on what information that can be disclosed depending on the reasons. A prior written informed consent must be obtained from the client before disclosing it to other parties. </p>

                        <p className="mb-2">For clients under the EAP program, the employer will receive only aggregated data and a general progress summary of the EAP program, nothing specific about any individuals will be disclosed unless there is a risk to self, others or by others. </p>

                        <h3 className="semi_hedding">Client's Rights  </h3>

                        <ol>
                            <li className="mb-2">The client may ask questions or clarifications about anything in consultation. The consultant is
                                willing to discuss how and why certain decisions were made.
                            </li>

                            <li className="mb-2">The client may ask the consultant to try something that the client thinks may be helpful. The
                                consultant is willing to look for alternatives that may work better.
                            </li>

                            <li className="mb-2"> The client may cease to continue the consultation anytime, without any impediment and may return
                                to it anytime. Though a termination session(s) is highly recommended to have a proper closure for both sides. This applies as well whenever the client would like to change their attending consultant.
                            </li>

                            <li className="mb-2">The client may request to review his/her progress during the consultation session(s). The consultant
                                may provide a summary on a case-by-case basis which is beneficial to encourage client improvement in the session(s).
                            </li>

                            <li className="mb-2"> Right to confidentiality: Within limits provided for by law, all records and information acquired by
                                the consultants shall be kept strictly confidential in accordance with the principles of a doctor-patient relationship. All information will not be shared or revealed to any person, agency, or organization without the prior written consent of the client.
                            </li>

                            <li className="mb-2">The client can raise any concerns and speak with the consultant immediately of any concerns
                                provided that the consultant is likewise available to discuss matters with the client.
                            </li>

                            <li className="mb-2"> The client's human rights and dignity are to be respected at all times. This is also included for the
                                client's rights to be self-governing throughout the process.
                            </li>
                        </ol>
                        <h3 className="semi_hedding">Consultants' Rights and Responsibilities  </h3>
                        <p className="mb-2">Our consultants have the rights and/or responsibilities to; </p>
                        <ol>
                            <li className="mb-2">
                                Expect you to attend sessions regularly, be punctual and pay for services when rendered unless
                                previous arrangements are made i.e., you are under your company's sponsorship, social service agency.
                            </li>

                            <li className="mb-2">Expect you to show an acceptable level of commitment throughout the session i.e. follows through
                                on agreed-upon homework assignments or exercises, take initiative to schedule your next session </li>

                            <li className="mb-2">Expect you to turn on your video when attending a virtual session within a conducive environment.
                                We believe that this will help greatly in building rapport and effective communications.
                            </li>

                            <li className="mb-2">Expect you to communicate with the consultant if there are any dissatisfactions with the approach
                                taken by the consultant.
                            </li>

                            <li className="mb-2">Dismiss the client from the service with valid reasoning i.e. sexually harassed, threatened, abused verbally by the client
                            </li>

                            <li className="mb-2">The client's human rights and dignity are to be respected at all times. This also includes the
                                consultant's right to be respected i.e. to communicate respectfully.
                            </li>

                            <li className="mb-2"> Make a necessary report to management while maintaining the client's confidentiality in the case of
                                harassment and high dependency towards the consultant and therapy process/consultation service. </li>

                            <li className="mb-2"> Be protected and investigated by the Consultation Team if there are any complaints made by
                                the clients.
                            </li>

                            <li className="mb-2">Commit and act in the best interest of the client (s) and maintain a professional relationship.
                            </li>

                            <li className="mb-2">Maintain a reasonable level of current knowledge and skills in our therapeutic practice. </li>

                            <li className="mb-2"> Be in good standing with their professional association(s).
                            </li>

                            <li className="mb-2"> Practice within their credentials and limitations only (e.g. practice within qualified areas of
                                expertise and training).
                            </li>
                        </ol>

                        <h3 className="semi_hedding" >Minors (Clients' Under 18) </h3>
                        <p className="mb-2">If you are under 18 years of age, please be aware: </p>
                        <ol>
                            <li className="mb-2"> You will need to complete a parental consent form as proof that the parents acknowledged and
                                allowed the client to proceed with the consultation session(s).
                            </li>

                            <li className="mb-2">That the law may provide the client's parents with the right to examine treatment records.
                            </li>

                            <li className="mb-2">It is our policy to request an agreement from parents that parents can have access to relevant,
                                general and consented information only. This information will be reported in the treatment progress report, consented by the client.
                            </li>

                            <li className="mb-2">If the consultant feels there is a high risk that the client will seriously harm his/herself or someone
                                else, more details will be provided as seen fit.
                            </li>

                            <li className="mb-2"> In cases of possible harm, we will notify the parents of the concerns, and provide them with a
                                summary of the treatment when it is complete. Duty to Warn policy will be applied.
                            </li>

                            <li className="mb-2">Before providing any information, the consultant will discuss the matter with the client, if possible,
                                and do their best to handle any objections the client may have with what is prepared to be discussed.
                            </li>
                        </ol>

                        <h3 className="semi_hedding">Usage of  app Video Call Feature for Virtual Consultation </h3>
                        <p className="mb-2">The Consultation Service also provides an option for the client to utilize the  app video call feature as a platform for the consultation session(s) to be held other than Google Meet or Zoom if your consultant is your coach on the app. Please kindly note that session(s) that make use of this feature might be recorded only if the client gives consent for it. </p>
                        <ol>
                            <li className="boldtextcls">Who will have access to my recorded data? </li>
                            <p className="mb-2">A:  personnel who develop Machine Learning (ML) models, including but not limited to  Data Science Analysts or domain experts (i.e. Therapists) or relevant third parties with technical expertise may be given access to the recordings. </p>

                            <li className="boldtextcls"> How will the recordings be stored and how can they be retrieved? </li>
                            <p className="mb-2">A: The recordings are stored within our secured HIPAA compliant AWS (Amazon Web Services) infrastructure, on an S3 data lake within a secured VPC (Virtual Private Cloud). Only specific  Data Analysts will have access to retrieve it.
                            </p>

                            <li className="boldtextcls">How and why will the recordings be used? </li>
                            <p className="mb-2">A:  will use the recordings to enable the creation of specialized data products that will improve our coach's effectiveness and our members' health outcomes. For the recordings to be useful for ML models (a process or set of rules to be followed in calculations or other problem-solving operations, especially by a computer), they do need to be labelled by our domain experts.
                            </p>

                            <li className="boldtextcls"> How long will the recordings be stored?</li>
                            <p className="mb-2">A:  will store recordings indefinitely. As we continue to evolve our services, we might be able to create new data products in the future that we cannot build today with available technologies. All videos will be completely anonymised after 1 year. </p>

                            <li className="boldtextcls">Will I be allowed to opt out of the recording? </li>
                            <p className="mb-2">A: Yes, you will. Members will be notified about the recording before it happens and have the right to opt out from being recorded. </p>
                        </ol>

                        <h3 className="semi_hedding">Cancellation, Rescheduling and No-show Policies  </h3>

                        <p className="mb-2">If you need to reschedule or cancel your session once it has been confirmed, please let us know with at least 24 hours' notice by emailing consultation@.life or call us at +603-2935-8101. </p>

                        <p className="mb-2">Without such notice, you agree to forfeit 50% of the session fee or the amount will be charged to your company if you are under an EAP program.
                        </p>

                        <p className="mb-2">In that same spirit,  reserves the right to modify or cancel any session at least 24 hours in advance should a regrettable, unforeseen circumstance arise. You will be informed of any such change via phone and email. In the unlikely event that a psychologist, counsellor or coach does not provide notice, the next session will be provided free of charge at an alternate date and time agreed upon or refunded in accordance with the refund policy.
                        </p>

                        <p className="mb-2">No-shows for confirmed sessions will be treated as last-minute cancellations and will result in a forfeiture of 50% of the session fee.
                        </p>

                        <p className="mb-2">Special exceptions or accommodations may be extended regarding this policy due to extenuating circumstances but are subject to 's discretion.
                        </p>
                        <h3 className="semi_hedding">Acknowledgement </h3>
                        <p className="mb-2">With the extension of consultation services provided by  via online platforms, by scheduling an appointment, you are accepting full responsibility for any information that is released during the session(s) and will not hold  accountable for any information that may be disclosed on your end. This may be and is not limited to having the session(s) in the same room as your spouse, family members, or any individual present who may be listening in the background.
                        </p>

                        <p className="mb-2">By agreeing to provide your personal details to  Hidup Sdn Bhd to book your appointment and for record-keeping purposes, you also give  permission to contact the emergency contact person should  perceive the need to do so in case of emergency, crisis or any relevant circumstances.
                        </p>

                        <p className="mb-2">By providing your personal details, you also acknowledge that you have read and agree to the clauses stated above. </p>

                        <p className="noteclss">Note. if you have any concerns regarding the consent form, do note them down and feel free to discuss them with your consultant during your first session</p>


                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={e => modalClosed('agree')}>{form.consentAgree ? 'Agreed' : 'Agree'}</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ContentModal