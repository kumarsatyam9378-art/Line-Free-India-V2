#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generates LINE_FREE_INDIA_GUIDE.pdf
A beginner-friendly (Hinglish) project guide for Smart India Hackathon.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem,
    Table, TableStyle, PageBreak, HRFlowable, KeepTogether
)

OUT = "LINE_FREE_INDIA_GUIDE.pdf"

# ---------- colors ----------
PRIMARY = colors.HexColor("#5b5bf0")
ACCENT  = colors.HexColor("#ff7a59")
DARK    = colors.HexColor("#1a1c2e")
LIGHT   = colors.HexColor("#f4f6fb")
GREEN   = colors.HexColor("#18a558")
GREY    = colors.HexColor("#6b7280")
BORDER  = colors.HexColor("#e6e8f0")

# ---------- styles ----------
ss = getSampleStyleSheet()

def make_style(name, **kw):
    return ParagraphStyle(name, parent=ss["Normal"], **kw)

title_st   = make_style("title", fontName="Helvetica-Bold", fontSize=30,
                        textColor=DARK, leading=34, spaceAfter=6)
subtitle_st= make_style("subtitle", fontName="Helvetica", fontSize=14,
                        textColor=PRIMARY, leading=18, spaceAfter=4)
cover_small= make_style("coversmall", fontName="Helvetica", fontSize=12,
                        textColor=GREY, leading=16)
h1_st      = make_style("h1", fontName="Helvetica-Bold", fontSize=17,
                        textColor=PRIMARY, leading=21, spaceBefore=10, spaceAfter=6)
h2_st      = make_style("h2", fontName="Helvetica-Bold", fontSize=13,
                        textColor=DARK, leading=17, spaceBefore=8, spaceAfter=3)
body_st    = make_style("body", fontName="Helvetica", fontSize=11,
                        textColor=DARK, leading=16, spaceAfter=6, alignment=TA_JUSTIFY)
bullet_st  = make_style("bullet", fontName="Helvetica", fontSize=11,
                        textColor=DARK, leading=15)
q_st       = make_style("q", fontName="Helvetica-Bold", fontSize=11,
                        textColor=PRIMARY, leading=15, spaceBefore=6, spaceAfter=2)
a_st       = make_style("a", fontName="Helvetica", fontSize=11,
                        textColor=DARK, leading=15, spaceAfter=8, alignment=TA_JUSTIFY)
note_st    = make_style("note", fontName="Helvetica-Oblique", fontSize=10,
                        textColor=GREY, leading=14, spaceAfter=8)
code_st    = make_style("code", fontName="Courier", fontSize=10,
                        textColor=colors.HexColor("#4343d6"), leading=14,
                        backColor=LIGHT, borderPadding=6, spaceAfter=8)

story = []

def P(text, st=body_st):
    story.append(Paragraph(text, st))

def H1(text):
    story.append(Paragraph(text, h1_st))

def H2(text):
    story.append(Paragraph(text, h2_st))

def SP(h=6):
    story.append(Spacer(1, h))

def bullets(items, st=bullet_st):
    flow = ListFlowable(
        [ListItem(Paragraph(t, st), leftIndent=10, value="•") for t in items],
        bulletType="bullet", start="•", leftIndent=14, bulletColor=PRIMARY,
    )
    story.append(flow)
    SP(4)

def hr():
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER,
                            spaceBefore=6, spaceAfter=8))

def table(data, col_widths, header=True):
    t = Table(data, colWidths=col_widths, hAlign="LEFT")
    style = [
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("FONTSIZE", (0,0), (-1,-1), 9.5),
        ("LEFTPADDING", (0,0), (-1,-1), 6),
        ("RIGHTPADDING", (0,0), (-1,-1), 6),
        ("TOPPADDING", (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ("GRID", (0,0), (-1,-1), 0.5, BORDER),
        ("ROWBACKGROUNDS", (0,1 if header else 0), (-1,-1), [colors.white, LIGHT]),
    ]
    if header:
        style += [
            ("BACKGROUND", (0,0), (-1,0), PRIMARY),
            ("TEXTCOLOR", (0,0), (-1,0), colors.white),
            ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
        ]
    t.setStyle(TableStyle(style))
    story.append(t)
    SP(8)

# =========================================================
# COVER PAGE
# =========================================================
SP(40)
P("LINE-FREE INDIA", title_st)
P("Digital Token and Queue Management System", subtitle_st)
SP(14)
P("Smart India Hackathon — Project Documentation and Study Guide", cover_small)
P("Ek complete guide jo aapko project samjhaaye, present karne mein help kare,", cover_small)
P("aur sir / judge ke har sawaal ka jawab dene layak banaye.", cover_small)
SP(30)
# cover info box
cover_tbl = Table([
    ["Project Name", "Line-Free India"],
    ["Category", "Beauty, Wellness and Healthcare Queue Management"],
    ["Problem", "Lambi line aur wait time salons, spas aur clinics mein"],
    ["Solution", "Phone se digital token lo, line ghar baith kar track karo"],
    ["Current Demo", "3 files: index.html + style.css + script.js (no login)"],
    ["Tech (full app)", "React, Firebase, Tailwind CSS, Maps, PWA"],
], colWidths=[4*cm, 11*cm])
cover_tbl.setStyle(TableStyle([
    ("FONTSIZE", (0,0), (-1,-1), 10),
    ("FONTNAME", (0,0), (0,-1), "Helvetica-Bold"),
    ("TEXTCOLOR", (0,0), (0,-1), PRIMARY),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("GRID", (0,0), (-1,-1), 0.5, BORDER),
    ("BACKGROUND", (0,0), (0,-1), LIGHT),
    ("TOPPADDING", (0,0), (-1,-1), 6),
    ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ("LEFTPADDING", (0,0), (-1,-1), 8),
]))
story.append(cover_tbl)
SP(20)
P("Note: Ye guide Hinglish (Roman Hindi) mein hai taaki aapko har word samajh aaye. "
  "Present karte waqt aap isse Hindi ya English mein bol sakte hain.", note_st)
story.append(PageBreak())

# =========================================================
# 1. PROJECT OVERVIEW
# =========================================================
H1("1. Project Kya Hai? (Project Overview)")
P("<b>Line-Free India</b> ek aisa mobile/web app hai jo <b>physical queue (line) ko khatam</b> karta hai. "
  "India mein salons, spas, barber shops aur clinics mein log ghanto line mein khade rehte hain. "
  "Is app se customer apne phone se <b>digital token</b> (ek number) leta hai, apni position dekhta hai, "
  "aur jab uski turn aati hai tab pahuchta hai — matlab bina line mein khade hue kaam ho jata hai.")
H2("Problem (Samasya)")
bullets([
    "Salon, spa, clinic aur barber shop mein bheed aur lambi line hoti hai.",
    "Customer ko pata nahi hota kitni der lagegi, toh wo ya toh jaldi jaata hai ya waiting mein time waste karta hai.",
    "Shop owner ke paas koi proper system nahi hota queue manage karne ka — sab manual hai.",
    "Chhote business owners technology use nahi kar paate easily.",
])
H2("Solution (Samadhan)")
bullets([
    "Customer app mein shop select karega aur <b>token</b> lega (jaise A-12).",
    "Usse dikhega: 'Aap line mein number 3 ho, lagbhag 15 minute wait'.",
    "Shop owner 'Call Next' dabayega aur next customer ko notify karega.",
    "Result: bheed kam, time bacha, business smooth chala.",
])
H2("Target Users (Kon use karega)")
bullets([
    "<b>Customers:</b> jo salon, spa, clinic jaate hain aur line nahi lagana chahte.",
    "<b>Shop Owners / Barbers:</b> jo apni queue digital tarike se manage karna chahte hain.",
    "<b>Small Businesses:</b> jo apna business grow karna chahte hain bina mehngi software ke.",
])
hr()
P("<b>Ek line mein samjho:</b> Aaj salon jaane ke liye aapko wahin khade hona padta hai. "
  "Line-Free India se aap ghar baithe token lete hain, TV ya phone pe dekhte hain kitne log aage hain, "
  "aur jab screen pe 'Aapki turn' aaye tab nikalte hain. Wahin shop wala screen pe sab customers dekhta hai "
  "aur ek button se next ko bula leta hai.", note_st)
story.append(PageBreak())

# =========================================================
# 2. HOW IT WORKS
# =========================================================
H1("2. Ye App Kaise Kaam Karta Hai? (Workflow)")
H2("Customer ka flow (Customer side)")
bullets([
    "Customer app kholta hai aur apne paas ki shop (salon/spa) select karta hai.",
    "Naam aur service choose karta hai, fir 'Get Token' dabata hai.",
    "App usko ek token number deta hai (e.g. A-12) aur batata hai position + estimated wait.",
    "Customer ghar ya kaam par rehta hai, phone pe live queue dekhta hai.",
    "Jab turn aati hai, notification aata hai — customer pahunchta hai, kaam ho jata hai.",
])
H2("Shop / Counter ka flow (Business side)")
bullets([
    "Shop owner apna dashboard kholta hai jisme live queue dikhti hai.",
    "Jaise hi ek customer free hota hai, owner 'Call Next' dabata hai.",
    "Next customer ka naam aur token screen par aata hai aur usko SMS/notification jaata hai.",
    "Owner analytics dekhta hai: kitne customer aaye, average wait time, earning, etc.",
])
H2("Working diagram (simple)")
table([
    ["Step", "Customer", "Shop"],
    ["1", "Shop select karein", "Shop open rakhein"],
    ["2", "Token lo (A-12)", "Live queue screen pe dekhein"],
    ["3", "Ghar baithe wait karein", "Call Next dabayein"],
    ["4", "Notification aaye toh pahunche", "Customer ko serve karein"],
    ["5", "Kaam ho gaya", "Next customer bulao"],
], col_widths=[2*cm, 6.5*cm, 6.5*cm])
story.append(PageBreak())

# =========================================================
# 3. THE 3-FILE DEMO
# =========================================================
H1("3. Abhi Jo Banaya Gaya Hai: 3-File Demo")
P("Maine original bade project ko simplify karke <b>3 files</b> mein ek working demo banaya hai. "
  "Isme <b>koi login nahi hai</b>, <b>koi backend nahi hai</b> — sirf HTML, CSS aur JavaScript. "
  "Ye beginner level hai, jaise school/college mein sikhate hain, lekin isme project ka poora concept dikhta hai.")
H2("Files aur unka kaam")
table([
    ["File", "Kaam (What it does)"],
    ["index.html", "Page ka structure banaata hai — header, customer panel, live queue, shop panel. Jaise ghar ka skeleton."],
    ["style.css", "Page ko sundar banata hai — colours, layout, buttons, mobile-friendly design. Jaise ghar ki painting."],
    ["script.js", "Page ko zinda karta hai — token generate karna, queue dikhana, call next, dark mode. Jaise ghar ka wiring/bijli."],
], col_widths=[3.5*cm, 11.5*cm])
H2("Demo run kaise karein")
P("Files <b>linefree-basic</b> folder mein hain. Inhe browser mein open karke dekh sakte hain:")
bullets([
    "Method 1: <b>linefree-basic/index.html</b> double-click karo — browser mein khul jayega.",
    "Method 2 (better): terminal mein <code>python3 -m http.server 8080</code> chalao aur browser mein <code>http://localhost:8080</code> khulo.",
    "Customer panel mein naam likho, token lo; Shop panel mein 'Call Next' dabao — queue live update hoti hai.",
])
P("Demo abhi live bhi hai (preview link par) taaki aap sir ko turant dikhha sako.", note_st)
story.append(PageBreak())

# =========================================================
# 4. FEATURES
# =========================================================
H1("4. Features (Kya-kya hai isme)")
H2("Jo demo mein abhi dikh raha hai (Core)")
table([
    ["Feature", "Explain (simple)"],
    ["Digital Token", "Customer ko ek number milta hai bina line lage"],
    ["Live Queue", "Sab log order mein dikhte hain, position pata chalti hai"],
    ["Estimated Wait", "Kitni der lagegi ye bhi batata hai"],
    ["Call Next", "Shop wala next customer ko bula leta hai"],
    ["Dark/Light Mode", "App ka colour theme change ho jata hai"],
], col_widths=[4*cm, 11*cm])
H2("Jo full project mein hai (future demo ke liye)")
table([
    ["Feature", "Explain"],
    ["Google Login", "Customer aur Shop alag-alag login karte hain"],
    ["Nearby Salons (GPS)", "Aapke paas ki shops map par dikhti hain"],
    ["Real-time Notifications", "Token call hone par message/notification aata hai"],
    ["Analytics Dashboard", "Shop ko pata chalta hai earning, wait time, customers"],
    ["Reviews and Ratings", "Customers shop ko rate kar sakte hain"],
    ["UPI Payment", "Online payment link bhi generate ho sakta hai"],
    ["WhatsApp Sharing", "Token WhatsApp par bheja ja sakta hai"],
    ["Referral System", "Dost ko refer karne par reward milta hai"],
], col_widths=[4*cm, 11*cm])
story.append(PageBreak())

# =========================================================
# 5. TECH STACK EXPLAINED
# =========================================================
H1("5. Tech Stack Samjho (Har technology simple bhasha mein)")
P("Bade project mein kaunsi technology use hui hai aur wo karti kya hai — simple words mein:")
table([
    ["Technology", "Kaam", "Simple example"],
    ["HTML", "Page ka structure", "Jaise ghar ka naksha"],
    ["CSS", "Page ki styling", "Jaise ghar ke rang aur sajawat"],
    ["JavaScript", "Page ki logic", "Jaise ghar ka bijli ka button"],
    ["React", "UI banana ki library", "Components se bada app aasaan banta hai"],
    ["Vite", "Fast build tool", "Code ko jaldi run karta hai"],
    ["Tailwind CSS", "CSS likhne ka fast tarika", "Class se style direct milti hai"],
    ["Firebase", "Backend + Database", "Data cloud mein save hota hai, login bhi"],
    ["Firestore", "Database", "Tokens aur users ki info yahan store hoti hai"],
    ["Maps (Leaflet)", "Location dikhata hai", "Nearby salons ka map"],
    ["PWA", "App jaise chalta hai", "Phone ke home screen par add ho jata hai"],
], col_widths=[3.2*cm, 4.8*cm, 7*cm])
H2("Backend aur Frontend kya hota hai?")
bullets([
    "<b>Frontend:</b> Jo user screen par dekhta hai (HTML/CSS/JS/React). Matlab 'dikhne wala' hissa.",
    "<b>Backend:</b> Jo chup chap kaam karta hai — data save karna, login check karna (Firebase). Matlab 'engine' wala hissa.",
    "<b>Database:</b> Data store karne ki jagah (jaise Firestore) — yahan tokens, users, shops ki info rehti hai.",
])
story.append(PageBreak())

# =========================================================
# 6. STEP BY STEP FILE ROADMAP
# =========================================================
H1("6. Aage Badhte Hue Kaun Sa File Add Karein? (Roadmap)")
P("Agar aap is 3-file demo ko badakar poora project banana chahte hain, toh step-by-step kaunsi cheez add karni hai "
  "aur usse kya faayda hoga — niche diya gaya hai. Ye aapko ye samjhaane mein help karega ki 'project grow kaise hua'.")
table([
    ["Step", "Add kya karein", "Kyun (purpose)"],
    ["1", "index.html, style.css, script.js", "Concept proof — bina login ke simple demo (abhi banaya hai)"],
    ["2", "Firebase setup (firebase.js)", "Data cloud mein save hoga, do device sync honge"],
    ["3", "auth.js (Login page)", "Customer aur Shop alag login — security aur personalisation"],
    ["4", "database rules", "Sirf sahi user hi apna data dekh paye — safety"],
    ["5", "Real-time listeners", "Token update hone par dono side turant change"],
    ["6", "Maps (leaflet.js)", "Nearby salons GPS se dikhani hain"],
    ["7", "Notifications", "Token call hone par message jaaye"],
    ["8", "Analytics page", "Shop ko reports aur earning dikhani hain"],
    ["9", "PWA (service worker)", "App phone ke home screen par chale"],
    ["10", "Admin panel", "Bade level par sab shops monitor karna"],
], col_widths=[1.3*cm, 4.7*cm, 9*cm])
P("<b>Moral:</b> Pehle 3 file se concept dikhao (jo humne kiya). Fir ek-ek karke upar wale steps add karo. "
  "Har step ek naya feature aur naya file/technology laata hai.", note_st)
story.append(PageBreak())

# =========================================================
# 7. TECH SKILLS
# =========================================================
H1("7. Tech Skills Jo Aap Seekhenge (aur bata payenge)")
P("Sir agar puchein 'tumne kya seekha?', toh ye list bol sakte hain:")
bullets([
    "<b>HTML:</b> web page ka structure banana.",
    "<b>CSS:</b> page ko design aur responsive (mobile-friendly) banana.",
    "<b>JavaScript:</b> page ko interactive banana — button click, data show, etc.",
    "<b>DOM Manipulation:</b> JavaScript se HTML elements ko badalna (jaise queue list update karna).",
    "<b>Local Storage:</b> data browser mein hi save karna (refresh ke baad bhi rehta hai).",
    "<b>React:</b> components se bada UI banana.",
    "<b>Firebase:</b> cloud database aur authentication use karna.",
    "<b>API / Real-time:</b> do device ke beech data sync karna.",
    "<b>Git aur GitHub:</b> code save aur team ke saath share karna (version control).",
    "<b>PWA:</b> website ko app jaise banana.",
])
story.append(PageBreak())

# =========================================================
# 8. NON-TECH SKILLS
# =========================================================
H1("8. Non-Tech Skills (Technical ke alawa jo seekhoge)")
P("Hackathon sirf coding nahi hai — ye skills bhi bante hain, aur judge inhe bhi dekhte hain:")
bullets([
    "<b>Problem Solving:</b> asli samasya pehchanna aur usko todna.",
    "<b>Teamwork:</b> saath mein kaam baatna aur milkar banana.",
    "<b>Communication:</b> apna idea dusron ko simple bhasha mein samjhana.",
    "<b>Presentation:</b> stage par confidently demo aur pitch dena.",
    "<b>Research:</b> market, competitors aur users samajhna.",
    "<b>Time Management:</b> kam time mein kaam nikaalna.",
    "<b>Design Thinking:</b> user ki taraf sochkar simple solution banana.",
    "<b>Storytelling:</b> project ko ek kahani ki tarah present karna.",
])
hr()
P("Tip: Sir ko batao ki hackathon ne aapko sirf 'code likhna' nahi, balki 'problem solve karna aur present karna' sikhaya.", note_st)
story.append(PageBreak())

# =========================================================
# 9. Q&A - EXPECTED QUESTIONS
# =========================================================
H1("9. Sir / Judge Ke Sawaal aur Unke Jawab")
P("Niche sabse common questions hain jo SIH judges puuchte hain, aur unke simple answers. "
  "Inhe rat lo taaki koi bhi sawaal aaye toh aap confidently jawab de sako.")

def QA(q, a):
    story.append(Paragraph("Q. " + q, q_st))
    story.append(Paragraph(a, a_st))

QA("Aapka project exactly kya hai?",
   "Line-Free India ek digital token system hai. Isse customer bina line lage apne phone se token leta hai aur "
   "apni turn ghar baithe track karta hai; shop wala ek button se next customer ko bula leta hai. "
   "Isse salon, spa aur clinic ki line khatam hoti hai.")

QA("Ye problem India mein kyu important hai?",
   "India mein chhote shahron aur metro dono mein salons, barber shops aur clinics mein bheed hoti hai. "
   "Log wait karne mein time waste karte hain. Digital Bharat ke daur mein ye solution simple aur desi hona chahiye — "
   "isme koi mehnga hardware nahi lagta, sirf phone chahiye.")

QA("Isme aapki kya unique baat hai (USP)?",
   "Existing solutions ya toh sirf appointment hain ya sirf big salons ke liye hain. Humari app chhote "
   "business owners ke liye simple hai, token-based real-time queue deti hai, aur customer ko bina kisi "
   "pareshani ke wait time pata chalta hai.")

QA("Aapne kaunsi technology use ki?",
   "Demo mein sirf HTML, CSS aur JavaScript use kiya gaya hai (3 files). Poore project mein React, Firebase, "
   "Tailwind CSS, Maps aur PWA use hua hai taaki real-time data aur mobile experience mile.")

QA("Real-time updates kaise hote hain?",
   "Full version mein Firebase Firestore use hota hai jo real-time sync deta hai — jab shop 'Call Next' dabata hai, "
   "toh customer ke phone par turant update aur notification aata hai.")

QA("Login kyun hataya demo mein?",
   "Demo sirf concept dikhane ke liye hai taaki koi bhi bina setup ke turant samajh le. Real project mein Google "
   "Login hai taaki data safe aur personalised rahe.")

QA("Security aur privacy ka kya plan hai?",
   "Firebase Authentication se login hoga, aur Firestore rules se sirf authorised user hi apna data dekh payega. "
   "Passwords encrypt rahenge. Customer ka sirf naam aur token store hoga, zyada personal data nahi.")

QA("Internet na ho toh kya hoga?",
   "PWA use karke hum offline support denge — token list phone par cache rahegi. Weak network wale area ke liye "
   "SMS notification ka option bhi rakh sakte hain.")

QA("Iska business model kya hai (paisa kaise aayega)?",
   "Shop owners se chhota monthly subscription, aur premium features (analytics, marketing) ke liye paid plan. "
   "Plus referral aur partner salons se commission.")

QA("Scale kaise karenge (badana kaise hai)?",
   "Firebase cloud pe hai toh lakho users handle ho sakte hain. Aage multi-city, multi-language (Hindi, Tamil, etc.) "
   "aur industries (doctor, bank, ration shop) tak expand kar sakte hain.")

QA("Smart India Hackathon se ye kaise judta hai?",
   "Ye Digital India, MSME empowerment aur healthcare queue reduction se directly judta hai. Beauty and wellness "
   "sector mein bahut women entrepreneurs hain — unhe digital tool milta hai. Isse crowding kam hoti hai (Swachh/"
   "Safe India bhi).")

QA("Sabse bada challenge kya aaya?",
   "Sabse bada challenge tha complex features ko simple 3-file demo mein samjhaana bina login ke, taaki concept "
   "clear ho. Dusra challenge tha real-time sync reliable banana.")

QA("Aage future scope kya hai?",
   "AI se wait time prediction, voice notification Hindi mein,政府对 government hospitals ke liye free version, "
   "aur analytics se shop growth suggestions. Multi-state rollout.")

QA("Demo abhi kaise dikhate ho?",
   "3-file demo live hai — customer panel se token lo, shop panel se 'Call Next' dabao, queue live update hoti hai. "
   "Ye bina kisi server ke browser mein turant chalta hai.")

QA("Team ne kaam kaise baata?",
   "(Yahan apni team ke hisaab se likhna) Example: ek ne design/HTML-CSS kiya, ek ne JavaScript logic, ek ne "
   "research aur presentation taiyaar ki. Har member ko ek clear role tha.")

story.append(PageBreak())

# =========================================================
# 10. PRESENTATION SCRIPT
# =========================================================
H1("10. Presentation Script (Stage par kya bolna hai)")
H2("1-Minute Pitch (elevator pitch)")
P("<b>'Namaskar sir. Main 'Line-Free India' laaya hoon. India mein salon, spa aur clinics mein log ghanto line "
  "mein khade rehte hain. Humari app se customer phone se digital token leta hai, ghar baithe apni turn dekhta hai "
  "aur jab bulaaye tab pahuchta hai. Shop wala ek button se queue manage karta hai. Result: bheed kam, time bacha, "
  "business smooth. Humne iska working demo 3 files (HTML, CSS, JS) mein banaya hai.'</b>")
H2("3-Minute Demo Flow")
bullets([
    "Pehle problem dikhao — ek salon ki lambi line ka example do.",
    "Fir demo open karo: customer ne token liya (A-12), position aur wait dikhao.",
    "Shop panel open karo, 'Call Next' dabao — queue update hoti hai dikhao.",
    "Batao ki ye concept Firebase aur real-time se scale hoga.",
    "Aakhir mein future scope aur SIH alignment batao.",
])
H2("Do's and Don'ts on stage")
bullets([
    "Do: confident raho, simple bhasha use karo, demo pehle se check kar lo.",
    "Do: eye contact rakho, judge ko involve karo ('aap try kar sakte hain').",
    "Don't: bahut technical jargon mat feko agar judge beginner hai.",
    "Don't: demo ke beech code ki lambi lines mat padho — sirf flow samjhao.",
])
story.append(PageBreak())

# =========================================================
# 11. GLOSSARY
# =========================================================
H1("11. Glossary (Terms simple Hindi mein)")
table([
    ["Term", "Matlab"],
    ["Frontend", "Jo screen par dikhta hai (HTML/CSS/JS)"],
    ["Backend", "Jo chup chap data aur logic sambhalta hai"],
    ["Database", "Data store karne ki jagah (jaise almari)"],
    ["Token", "Ek unique number jo queue mein aapki jagah batata hai"],
    ["Real-time", "Bina refresh kiye data turant update hona"],
    ["API", "Do software ke beech baat-cheet ka bridge"],
    ["Authentication", "Login verify karna ki user sahi hai"],
    ["PWA", "Website jo phone app jaise chalta hai"],
    ["GPS", "Location batane wali technology"],
    ["UI / UX", "User Interface aur User Experience (design)"],
    ["Git / GitHub", "Code save aur share karne ka system"],
    ["Deploy", "Apni app ko internet par live karna"],
    ["Scalability", "Bade level par bhi sahi chalna"],
], col_widths=[4*cm, 11*cm])
SP(10)
P("<b>Best of luck for Smart India Hackathon! </b> Is guide ko padh lo, demo dikhao, aur confident raho. "
  "Aapke paas concept, working demo aur saare answers taiyaar hain. 🚀", note_st)

# =========================================================
# BUILD
# =========================================================
def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(GREY)
    canvas.drawString(2*cm, 1*cm, "Line-Free India — SIH Project Guide")
    canvas.drawRightString(A4[0]-2*cm, 1*cm, "Page %d" % doc.page)
    canvas.setStrokeColor(BORDER)
    canvas.line(2*cm, 1.3*cm, A4[0]-2*cm, 1.3*cm)
    canvas.restoreState()

doc = SimpleDocTemplate(
    OUT, pagesize=A4,
    leftMargin=2*cm, rightMargin=2*cm,
    topMargin=1.6*cm, bottomMargin=1.6*cm,
    title="Line-Free India — SIH Guide",
    author="Line-Free India Team",
)
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print("PDF built:", OUT)
