# Feature prioritisation — MoSCoW (step A2, Template F)

MoSCoW sorts features into four groups: **Must** (the MVP fails without it),
**Should** (important, but the core journey works without it), **Could** (nice to have),
**Won't** (deliberately left out of this version).

The "Customer evidence" column must come from the team's own CustDev interviews
(Assignment 3). It is left empty on purpose: fill it with real findings, and move a
feature to another group if the evidence does not support it.

| Feature | Customer evidence | Category | Effort | Risk / dependency | Decision |
| --- | --- | --- | --- | --- | --- |
| Read label text from a photo | *to fill from CustDev* | Must | Medium | Depends on the AI service and photo quality | Built |
| Translate each label part into Kazakh and Russian | *to fill from CustDev* | Must | Medium | AI can mistranslate; needs human review | Built |
| Let the user edit every translation | *to fill from CustDev* | Must | Low | — | Built |
| Check required details on food labels (TR CU 022/2011, art. 4, part 4.1) | *to fill from CustDev* | Must | Low | Covers the general list only | Built |
| Interface in English and Kazakh | Course requirement | Must | Low | Kazakh text needs review by a fluent speaker | Built |
| Download the finished label (print / PDF / text) | *to fill from CustDev* | Must | Low | — | Built |
| Clear messages for wrong files and AI failures | Course requirement (boundary case) | Must | Low | — | Built |
| Built-in sample labels | Makes testing possible without a product in hand | Should | Low | — | Built |
| Request limit per visitor | Protects the AI key from overuse | Should | Low | In-memory only | Built |
| Sticker sizes and layout templates | *to fill from CustDev* | Could | Medium | Needs printer details from customers | Not built |
| Several photos per product (front and back) | *to fill from CustDev* | Could | Medium | — | Not built |
| User accounts and saved labels | *to fill from CustDev* | Won't (now) | High | Needs a database and personal-data handling | Left out |
| Payment | *to fill from CustDev* | Won't (now) | High | Legal and security work | Left out |
| Automated regulatory checks for cosmetics and other non-food products | *to fill from CustDev* | Won't (now) | High | Different regulations | Left out |
| Batch upload of many labels | *to fill from CustDev* | Won't (now) | Medium | AI cost | Left out |
