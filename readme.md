## INTRODUCTION

<br />
Stray cattle roaming around freely in the cities have become a serious menace. Several lives have already been lost and many have been injured due to accidents involving stray cattle. The root cause of the problem is the unplanned dairies, inside and around the city. The owners, after milking the cattle, leave them loose so that they can graze outside. Non-milking cattle is also left loose to save on their feed. The problem of stray cattle on roads is not new in India, and these animals often bring the flow of traffic on busy roads to a standstill along with major road accidents. Stray cattle roaming around freely in the cities have become a serious problem. The problems of impounding these cattle are many.
<br />

This project creates a platform which coalesce the local people with Animal Husbandry,NGOs and Civic Forums.The local people can report stray cattle in nearby locations to these organizations, which in turn will act accordingly.

## THE APPLICATION

User will submit the information to the system about stray cattle in the form of reports.The report will contain

- Type of cattle
- Approximate size of the herd
- If they have a GI tag
- Are the cattle moving ?
- Image of the surrounding (to read GI tags)
  <br />

Using such minor but vital information we will be able to provide information to the stakeholders.
<br />

Now , the report can be bifurcated into two types based on type the user selects,

- General report
- Health report

##### GENERAL REPORT

This category of report indicates the normal appearance of cattle in the neighborhood ,the system will treat it as a normal report and will just provide a notification on the dashboard of the stakeholders

##### HEALTH REPORT

The health report is a priority report, it indicates either the cattle(s) are sick or the cattle(s) are causing health hazard to other people. Health reports will instantly fire a notification to stakeholders so that they can take actions instantly.

<br />

##### System Design

<img src="https://github.com/Ferin79/Cattle-Stray/raw/master/admin/public/custom/static/system-design.png" alt="System Design"/>

<br />

## LIFE-CYCLE OF REPORT

The report, after submission by the user can be in one of the four stages:

- Submitted
- Processing
- Rejected
- Resolved

##### Submitted Reports

The report becomes a submitted report after successfully submitted by the user.

##### Processing Reports

The reports successfully delivered to the stakeholder and are waiting for an action are the in process reports.

##### Rejected Reports

The stakeholders can reject the report request according to the originality of the details.

##### Resolved Reports

The reports which are genuine and are already acted upon are the resolved reports.

<br />

##### Schema

<img src="https://github.com/Ferin79/Cattle-Stray/raw/master/admin/public/custom/static/schema.png" alt="Schema"/>

<br />

## AUTHENTICATION OF REPORTS

There may be cases where multiple users spot cattle in same locality ,multiple reports will create redundancy and there may be cases where some mischievous users report fake cattle presence,such cases must require disciplinary actions.To avoid maximum of such cases , we have added a feature of upvote and downvote.

#### UPVOTE

Suppose user A reported a herd of cattle at some location,now user B also spots a herd of cattle in the same locality, the application will automatically show an already existing report in user B’s screen , so he/she can upvote the report of user A.

#### DOWNVOTE

Similarly to upvote, downvote works the opposite way .If user X provides a fake report and a user Y spots no cattle in nearby areas ,he/she can downvote the report.

##### WHAT GOOD UPVOTE AND DOWNVOTE WILL DO?

Introducing the feature of upvote and downvote , the manual work of removing redundancy as well authentication of reports can be reduced considerably.
The reports with more upvotes will be displayed on top of the report list,while the reports with more downvotes will be prioritized least.
<br />
Prioritizing reports ensures that the reports which are genuine and require immediate actions ,are presented to the stakeholders at first.The health reports will have the highest priority,followed by the reports with highest upvotes and the reports with more downvotes will be the least.

<br />

##### Activity Diagram

<img src="https://github.com/Ferin79/Cattle-Stray/raw/master/admin/public/custom/static/Activity.png" alt="Activity Diagram"/>

<br />

## ADMIN

Too much control to the users over the app will do more harm than good.So to manage the users, there is an admin role in the system.
<br />
The admins are classified into two categories namely,

- SUPER ADMIN ( The government itself )
- The organizations

#### SUPER ADMIN

The government will have the full access to all the data of the application. The role of main admin is very crucial , the main admin can add or remove organizations , keep a check on the user reports and many more disciplinary actions.
Only the super admin will have access to the details of all the organizations and all the users.

#### THE ORGANIZATIONS

It is not feasible for the government to look at all the requests submitted by the users,so a middleware is required who will answer the government and respond to the users. The sub admins, will handle all the reports made by the users. Since there are multiple stakeholders of the system we have integrated role based user system in which following roles are identified. However, system is designed in a manner in which roles could be added further based on the requirements.
<br />
The organizations cannot access the information about the user who has reported, so the task of the organization is to respond to the pending requests. The reports will be displayed on the dashboard, the reports will be prioritized and presented.

<br />

##### Data Flow Diagram

<img src="https://github.com/Ferin79/Cattle-Stray/raw/master/admin/public/custom/static/DFD.png" alt="Data flow Diagram"/>

<br />

## TECH STACK

<br />

<img src="https://github.com/Ferin79/Cattle-Stray/raw/master/admin/public/custom/static/react-firebase.png" alt="React & Firebase" width="250" height="250"/>

##### React + Firebase ( Web App )

<br />
<br />

<img src="https://github.com/Ferin79/Cattle-Stray/raw/master/admin/public/custom/static/mobile-app.png" alt="Expo/React-Native & Firebase" width="50%"/>

##### Expo (React-Native) + Firebase ( Cross-platform mobile app )

<br />
<br />

<img src="https://github.com/Ferin79/Cattle-Stray/raw/master/admin/public/custom/static/postman.png" alt="Postman" width="50%"/>

##### Postman ( API Testing and documentation )
