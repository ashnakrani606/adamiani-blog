"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Brain, Clock, Stethoscope, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [language, setLanguage] = useState("en");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("patient");
  const [message, setMessage] = useState("");

  const [isRegistered, setIsRegistered] = useState(false);
  const [freeQuestionsLeft, setFreeQuestionsLeft] = useState(10);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const FREE_LIMIT = 10;

 // refresh-ზე ვამოწმებთ ბრაუზერის მეხსიერებას
  useEffect(() => {
    const saved = localStorage.getItem("adamiani_registered");
    if (saved === "true") {
      setIsRegistered(true);
    }

    const savedQuestions = localStorage.getItem("adamiani_questions_left");
    if (savedQuestions !== null) {
      setFreeQuestionsLeft(parseInt(savedQuestions, 10));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("adamiani_questions_left", String(freeQuestionsLeft));
  }, [freeQuestionsLeft]);

const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>([]);
const chatEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const container = chatEndRef.current?.parentElement;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}, [chatMessages]);
const saveEmail = async () => {
  if (!name || !email) {
    alert(language === "ka" ? "შეავსეთ ყველა ველი" : "Please fill in all fields");
    return;
  }

  const { error } = await supabase
    .from("waitlist")
    .insert([{ name, email, role, user_type: role }]);

  if (error) {
    if (error.code === "23505") {
      setIsRegistered(true);
      setShowRegisterModal(false);
      localStorage.setItem("adamiani_registered", "true");
    } else {
      alert(language === "ka" ? "დაფიქსირდა შეცდომა" : "An error occurred");
      console.error(error);
    }
    return;
  }

  setIsRegistered(true);
  setShowRegisterModal(false);
  localStorage.setItem("adamiani_registered", "true");
  setEmail("");
  setName("");
  setRole("patient");
};

const sendMessage = async () => {
  if (!message.trim()) return;

  if (!isRegistered) {
    setShowRegisterModal(true);
    return;
  }

if (freeQuestionsLeft <= 0) {
    // ჩატში ვამატებთ შეტყობინებას (თუ უკვე არ არის)
    setChatMessages((prev) => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg && lastMsg.text === t.chatLimitReached) {
        return prev; // უკვე ნაჩვენებია, არ ვიმეორებთ
      }
      return [...prev, { role: "assistant", text: t.chatLimitReached }];
    });

    // ცოტა დაყოვნებით Pricing-ზე გადავყავართ
    setTimeout(() => {
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    }, 1500);
    return;
  }
  const userMessage = message;
  setMessage("");

  // პაციენტის შეტყობინება + დროებითი "ფიქრობს..." პასუხი
  setChatMessages((prev) => [
    ...prev,
    { role: "user", text: userMessage },
    { role: "assistant", text: "..." },
  ]);

  setFreeQuestionsLeft((prev) => prev - 1);

  try {
    // ვაგზავნით მთელ საუბარს backend-ში
    const conversation = [
      ...chatMessages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      })),
      { role: "user", content: userMessage },
    ];

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversation }),
    });

    const data = await res.json();
    const reply = data.reply || t.chatDemoReply;

    // "ფიქრობს..." ვცვლით ნამდვილი პასუხით
    setChatMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = { role: "assistant", text: reply };
      return updated;
    });
  } catch (error) {
    console.error(error);
    setChatMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        role: "assistant",
        text: t.chatDemoReply,
      };
      return updated;
    });
  }
};

  const content = {
    ka: {
      nav: ["მთავარი", "AI ასისტენტი", "ხედვა", "ფასები", "ჩვენ შესახებ"],
      title: "AI გისმენს. ნამდვილი ექიმები გპასუხობენ. გადაწყვეტილებას შენ იღებ.",
      description:
        "ჯანმრთელობის გადაწყვეტილება მარტო ნუ მიიღებ. გაურკვევლობას სიცხადით ვცვლით.",
      start: "გამოგვყევი",
      startSecondary: "ჩაეწერე სიაში",
      cards: ["AI ჯანმრთელობის ანალიზი", "სიცოცხლის ისტორია", "ექიმთან დაკავშირება"],
      previewTitle: "AI ასისტენტის მაგალითი",
      userMessage: "ბოლო დღეებში ხშირად მტკივა თავი და დაღლილობას ვგრძნობ.",
      aiMessage:
        "მესმის. მოდი შევაფასოთ სიმპტომები, ხანგრძლივობა და რისკ-ფაქტორები. საჭიროების შემთხვევაში ექიმთან დაკავშირებასაც შემოგთავაზებ.",
       chatTitle: "სცადე Adamiani.ai ასისტენტი",
      chatSubtitle: "აღწერე სიმპტომები და მიიღე პირველადი დემო პასუხი.",
      chatDemoLabel: "AI ექიმის დემო",
      chatAssistantName: "Adamiani.ai ასისტენტი",
      freeQuestionsLabel: "დარჩენილი უფასო კითხვები",
      chatPlaceholder: "მაგ: მაქვს სიცხე და ყელის ტკივილი...",
      sendButton: "გაგზავნა",
      chatLimitReached: "თქვენი უფასო კითხვები ამოიწურა. სრული წვდომისთვის აირჩიეთ პაკეტი ქვემოთ. 👇",
      chatGreeting: "გამარჯობა, მე ვარ Adamiani.ai-ის AI ასისტენტი. მომწერეთ რა გაწუხებთ და დაგეხმარებით პირველ შეფასებაში.",
      chatDemoReply: "მადლობა. თქვენი სიმპტომები მიღებულია. ეს არის დემო პასუხი. შემდეგ ეტაპზე აქ რეალური AI ექიმი იმუშავებს.",
      problemTag: "პრობლემა",
      problemTitle:
        "ჯანმრთელობა შენი ყველაზე ძვირფასი აქტივია. არ უნდა იცოდე, რომ ის სანდო ხელშია?",
      problemSubtitle:
        "დღეს ინფორმაცია გაფანტულია — ანალიზები ერთ კლინიკაშია, დასკვნები მეორეში, რეკომენდაციები კი ხშირად იკარგება.",
      problemStats: [
        { value: "88%", label: "ზრდასრულს უჭირს ჯანმრთელობის ინფორმაციის გააზრება და სისტემაში ნავიგაცია" },
        { value: "~15 წთ", label: "საშუალო დრო, რომელსაც ექიმი ერთ პაციენტს უთმობს" },
        { value: "გაფანტული", label: "ჯანმრთელობის ისტორია მიმოფანტულია კლინიკებს, აპლიკაციებსა და ქაღალდს შორის" },
      ],
      problemSource: "წყარო: NIH health literacy კვლევები; აშშ პირველადი ჯანდაცვის მონაცემები",

      visionTag: "ხედვა",
      visionTitle: "რას ვაშენებთ",
      visionSubtitle:
        "Adamiani.ai არ არის უბრალოდ ჩატბოტი. ეს არის შენი ჯანმრთელობის ერთიანი სივრცე — ოთხ ფენად.",
      visionLayers: [
        { title: "მეხსიერება", text: "მთელი ჯანმრთელობის ისტორია ერთ ადგილას — ანალიზები, დიაგნოზები, წამლები." },
        { title: "გაანალიზება", text: "AI გიხსნის რას ნიშნავს შენი მონაცემები — მარტივ, გასაგებ ენაზე." },
        { title: "ხელმძღვანელობა", text: "შემდეგი ნაბიჯის რეკომენდაცია — როდის დაისვენო, როდის მიმართო ექიმს." },
        { title: "კავშირი", text: "საჭიროების შემთხვევაში — სანდო, ვერიფიცირებულ ექიმთან პირდაპირი წვდომა." },
      ],

      timelineTag: "ჯანმრთელობის ისტორია",
      timelineTitle: "მთელი ჯანმრთელობის ისტორია ერთ ქრონოლოგიურ ხაზზე",
      timelineSubtitle:
        "ანალიზები, დიაგნოზები, წამლები, ვიზიტები და რეკომენდაციები — ყველაფერი ერთ ადგილას, მთელი ცხოვრების განმავლობაში.",
      timelineItems: [
        { year: "2023", title: "სისხლის ანალიზი" },
        { year: "2024", title: "კარდიოლოგის ვიზიტი" },
        { year: "2025", title: "MRI კვლევა" },
        { year: "2026", title: "AI ჯანმრთელობის შეფასება" },
      ],

      howTag: "პროცესი",
      howTitle: "როგორ მუშაობს",
      howSubtitle:
        "Adamiani.ai გაძლევს მარტივ გზას — შეაგროვო ინფორმაცია, მიიღო AI შეფასება და საჭირო დროს დაუკავშირდე ექიმს.",
      steps: [
        { title: "შეიყვანე მონაცემები", text: "დაამატე სიმპტომები, ანალიზები, წამლები და ჯანმრთელობის ისტორია." },
        { title: "მიიღე AI შეფასება", text: "AI ასისტენტი დაგეხმარება რისკების გააზრებაში და შემდეგი ნაბიჯის არჩევაში." },
        { title: "დაუკავშირდი ექიმს", text: "საჭიროების შემთხვევაში მიიღე რეალური ექიმის კონსულტაცია." },
      ],

      registerTag: "ეკოსისტემა",
      registerTitle: "Adamiani.ai შექმნილია ყველასათვის",
      registerSubtitle:
        "ადამიანებისთვის, ექიმებისთვის და კლინიკებისთვის — ერთიანი ჯანმრთელობის ეკოსისტემა.",
      registerCards: [
        { title: "მომხმარებელი", text: "შეინახე ჯანმრთელობის ისტორია, ესაუბრე AI ასისტენტს და საჭირო დროს დაუკავშირდი ექიმს.", button: "გაიგე მეტი" },
        { title: "ექიმი", text: "შექმენი ექიმის პროფილი, მიიღე პაციენტები ონლაინ და გამოიყენე AI მხარდაჭერა.", button: "გაიგე მეტი" },
        { title: "კლინიკა", text: "დაარეგისტრირე კლინიკა, მართე ექიმები, პაციენტები და ონლაინ კონსულტაციები ერთ სივრცეში.", button: "გაიგე მეტი" },
      ],

      trustTag: "ნდობა და უსაფრთხოება",
      trustTitle: "შენი მონაცემები შენს კონტროლში რჩება",
      storageTitle: "სად შენახო შენი ინფორმაცია — შენ ირჩევ",
      storageSubtitle:
        "ვაშენებთ პლატფორმას, სადაც მონაცემთა შენახვის გზას შენ ირჩევ — არა ჩვენ.",
      storageOptions: [
        { icon: "☁️", title: "უსაფრთხო Cloud", text: "გვინდა შემოგთავაზოთ შენახვა მაღალი დონის შიფვრით დაცულ ევროპულ სერვერებზე." },
        { icon: "💻", title: "შენი მოწყობილობა", text: "მომავალში გვინდა შენ თვითონ შეძლო ინფორმაციის შენახვა დაშიფრული ფაილის სახით." },
        { icon: "🔀", title: "ჰიბრიდი", text: "ძირითადი ასლი შენთან, ხოლო backup დაშიფრულად ღრუბელში — მაქსიმალური მოქნილობა." },
      ],
      storageNote:
        "შენახვის ეს ვარიანტები ვითარდება — შენი მონაცემები ნებისმიერ ფაზაში დაშიფრულია და მხოლოდ შენი ნებართვით ზიარდება.",
      trustItems: [
        { title: "დაცული მონაცემები", text: "ყველა ჩანაწერი ინახება დაშიფრულ გარემოში და ეკუთვნის მხოლოდ მომხმარებელს." },
        { title: "ვერიფიცირებული ექიმები", text: "პლატფორმაზე მოხვედრამდე ექიმები გადიან მკაცრ ვერიფიკაციას." },
        { title: "AI ეხმარება, არ ცვლის", text: "AI არ ცვლის ექიმს — ის ეხმარება ადამიანს უკეთ გაიგოს საკუთარი ჯანმრთელობა." },
      ],

      storyTag: "რატომ „ადამიანი“",
      storyTitle: "სახელი, რომელიც ყველაფერს ხსნის",
      storyText:"ვირჩიეთ სახელი „ადამიანი“, რადგან სწორედ ეს დაიკარგა თანამედროვე მედიცინაში. პაციენტი ნომრად, დიაგნოზად, რიგად იქცა. ჩვენ გვინდა, რომ ტექნოლოგიამ ადამიანი ცენტრში დააბრუნოს — არა ჩაანაცვლოს ექიმი, არამედ მისცეს ყველას დრო, ყურადღება და გაგება.",
      testBadge: "🚧 სატესტო რეჟიმი — ეს ფუნქცია ჯერ მუშავდება",
      footerRights: "ყველა უფლება დაცულია.",
      footerPrivacy: "კონფიდენციალურობა",
      footerTerms: "პირობები",
      footerContact: "კონტაქტი",
      modalBadge: "უფასო წვდომა",
      modalTitle: "დარეგისტრირდი და მიიღე 10 უფასო AI პასუხი",
      modalText: "შეავსე მონაცემები რომ გააგრძელო ასისტენტთან საუბარი. ეს ასევე დაგამატებს ადრეული წვდომის სიაში.",
      modalNamePlaceholder: "თქვენი სახელი",
      modalButton: "რეგისტრაცია და გაგრძელება", 
      rolePatient: "პაციენტი",
      roleDoctor: "ექიმი",
      roleClinic: "კლინიკა",
      journeyTag: "შენი ჯანმრთელობა",
      journeyTitle: "დაიწყე შენი ჯანმრთელობის ისტორია დღეს",
      journeyText: "შეინახე ანალიზები, მიიღე AI შეფასებები და აკონტროლე შენი ჯანმრთელობა მთელი ცხოვრების განმავლობაში.",
      journeyChips: ["ჯანმრთელობის ისტორია", "AI ასისტენტი", "ექიმებთან კავშირი"],
      journeyButton: "დარეგისტრირდი უფასოდ",
      pricingTag: "ფასები",
      pricingTitle: "აირჩიე შენთვის შესაფერისი პაკეტი",
      pricingSubtitle: "დაიწყე უფასოდ და საჭიროების შემთხვევაში გადადი სრულ კონსულტაციაზე.",
      pricingPopular: "ყველაზე პოპულარული",
      pricingSelect: "არჩევა",
      plans: [
        {
          name: "უფასო",
          price: "$0",
          desc: "პირველი გაცნობისთვის",
          features: ["10 უფასო AI კონსულტაცია თვეში", "AI ასისტენტის ჩეთი", "საწყისი შეფასება"],
        },
        {
          name: "Personal",
          price: "$7 / თვე",
          desc: "პირადი ჯანმრთელობის კონტროლისთვის",
          features: ["შეუზღუდავი AI კითხვები", "ჯანმრთელობის ისტორია", "სიმპტომების ანალიზი"],
        },
        {
          name: "Doctor Access",
          price: "$18 / თვე",
          desc: "AI + ექიმის მხარდაჭერა",
          features: ["AI კონსულტაცია", "ექიმთან დაკავშირება", "პრიორიტეტული მხარდაჭერა"],
        },
      ],
      earlyTag: "ადრეული წვდომა",
      earlyTitle: "მიიღე ადრეული წვდომა",
      earlyText: "დარეგისტრირდი და პირველებმა მიიღეთ წვდომა Adamiani.ai პლატფორმაზე.",
      email: "შეიყვანე ელფოსტა",
      join: "დარეგისტრირება",
    },

    en: {
      nav: ["Home", "AI Assistant", "Vision", "Pricing", "About"],
      title: "AI listens. Real doctors answer. You decide.",
      description:
        "Don't face a health decision alone. We turn uncertainty into clarity.",
      start: "Follow along",
      startSecondary: "Join the waitlist",
      cards: ["AI Health Analysis", "Lifetime Health History", "Doctor Connection"],
      previewTitle: "AI Assistant Preview",
      userMessage: "I have had headaches and fatigue frequently over the past few days.",
      aiMessage:
        "I understand. Let's assess your symptoms, duration and risk factors. If needed, I can also help you connect with a doctor.",
chatTitle: "Try Adamiani.ai Assistant",
      chatSubtitle: "Describe your symptoms and get an initial demo response.",
      chatDemoLabel: "AI Doctor Demo",
      chatAssistantName: "Adamiani.ai Assistant",
      freeQuestionsLabel: "Free questions remaining",
      chatPlaceholder: "e.g. I have fever and sore throat...",
      sendButton: "Send",
      chatLimitReached: "You've used all your free questions. Choose a plan below for full access. 👇",
      chatGreeting: "Hello, I am the Adamiani.ai AI Assistant. Tell me your symptoms and I will help with an initial assessment.",
      chatDemoReply: "Thank you. Your symptoms have been received. This is a demo response. In the next stage, a real AI doctor will work here.",
      problemTag: "The Problem",
      problemTitle:
        "Your health is your most valuable asset. Shouldn't you know it's in safe hands?",
      problemSubtitle:
        "Today, health information is scattered — lab results in one clinic, reports in another, and recommendations often lost.",
      problemStats: [
        { value: "88%", label: "of adults struggle to understand health information and navigate the system" },
        { value: "~15 min", label: "average time a doctor spends with a single patient" },
        { value: "Scattered", label: "health history is spread across clinics, apps and paper" },
      ],
      problemSource: "Source: NIH health literacy studies; US primary care data",

      visionTag: "The Vision",
      visionTitle: "What we're building",
      visionSubtitle:
        "Adamiani.ai isn't just a chatbot. It's a unified space for your health — built in four layers.",
      visionLayers: [
        { title: "Memory", text: "Your entire health history in one place — labs, diagnoses, medications." },
        { title: "Understanding", text: "AI explains what your data means — in simple, clear language." },
        { title: "Guidance", text: "Recommendations on your next step — when to rest, when to see a doctor." },
        { title: "Connection", text: "When needed — direct access to a trusted, verified doctor." },
      ],

      timelineTag: "Health Timeline",
      timelineTitle: "Your entire health history in one timeline",
      timelineSubtitle:
        "Labs, diagnoses, medications, visits and recommendations — organized in one place throughout your life.",
      timelineItems: [
        { year: "2023", title: "Blood Test" },
        { year: "2024", title: "Cardiology Visit" },
        { year: "2025", title: "MRI Scan" },
        { year: "2026", title: "AI Health Assessment" },
      ],

      howTag: "Process",
      howTitle: "How it works",
      howSubtitle:
        "Adamiani.ai gives you a simple path to collect health information, receive AI guidance and connect with doctors when needed.",
      steps: [
        { title: "Add your health data", text: "Enter symptoms, lab results, medications and your medical history." },
        { title: "Get AI guidance", text: "The AI assistant helps you understand risks and choose the next step." },
        { title: "Connect with a doctor", text: "When needed, receive consultation from a real medical professional." },
      ],

      registerTag: "Ecosystem",
      registerTitle: "Adamiani.ai is built for everyone",
      registerSubtitle:
        "For people, doctors and clinics — one unified health ecosystem.",
      registerCards: [
        { title: "Patient", text: "Store your health history, talk to an AI assistant and connect with doctors when needed.", button: "Learn More" },
        { title: "Doctor", text: "Create your doctor profile, accept patients online and use AI-powered support.", button: "Learn More" },
        { title: "Clinic", text: "Register your clinic, manage doctors, patients and online consultations in one place.", button: "Learn More" },
      ],

      trustTag: "Trust & Security",
      trustTitle: "Your data stays under your control",
      storageTitle: "Where to store your data — you choose",
      storageSubtitle:
        "We're building a platform where you choose how your data is stored — not us.",
      storageOptions: [
        { icon: "☁️", title: "Secure Cloud", text: "We aim to offer storage on encrypted European servers." },
        { icon: "💻", title: "Your Own Device", text: "In the future, we want you to store information as an encrypted file on your own device." },
        { icon: "🔀", title: "Hybrid", text: "Primary copy with you, encrypted backup in the cloud — maximum flexibility." },
      ],
      storageNote:
        "These storage options are evolving — at every stage your data remains encrypted and is only shared with your permission.",
      trustItems: [
        { title: "Encrypted Records", text: "All records are stored in an encrypted environment and belong only to the user." },
        { title: "Verified Doctors", text: "Doctors go through rigorous verification before joining the platform." },
        { title: "AI Assists, Doesn't Replace", text: "AI does not replace doctors — it helps people better understand their own health." },
      ],

      storyTag: "Why Adamiani",
      storyTitle: "A name that explains everything",
      storyText:"We chose the name 'Adamiani' — Georgian for 'human' — because that's exactly what modern medicine has lost. The patient became a number, a diagnosis, a queue. We want technology to put the human back at the center — not to replace the doctor, but to give everyone time, attention and understanding.",
      testBadge: "🚧 Test mode — this feature is still in development",
      footerRights: "All rights reserved.",
      footerPrivacy: "Privacy",
      footerTerms: "Terms",
      footerContact: "Contact",
      modalBadge: "FREE ACCESS",
      modalTitle: "Register and get 10 free AI answers",
      modalText: "Fill in your details to continue chatting with the assistant. This also adds you to the early access list.",
      modalNamePlaceholder: "Your name",
      modalButton: "Register & Continue",
      rolePatient: "Patient",
      roleDoctor: "Doctor",
      roleClinic: "Clinic",
      journeyTag: "Your Health",
      journeyTitle: "Start Your Health Journey Today",
      journeyText: "Store your medical records, receive AI guidance and manage your health throughout your life.",
      journeyChips: ["Health Timeline", "AI Assistant", "Doctor Access"],
      journeyButton: "Register For Free",
      pricingTag: "Pricing",
      pricingTitle: "Choose the right plan for you",
      pricingSubtitle: "Start for free and upgrade whenever you need more support.",
      pricingPopular: "Most Popular",
      pricingSelect: "Select",
      plans: [
        {
          name: "Free",
          price: "$0",
          desc: "Perfect for getting started",
          features: ["10 AI consultations per month", "AI Assistant Chat", "Initial Assessment"],
        },
        {
          name: "Personal",
          price: "$7 / month",
          desc: "Personal health management",
          features: ["Unlimited AI consultations", "Health History", "Symptom Analysis"],
        },
        {
          name: "Doctor Access",
          price: "$18 / month",
          desc: "AI + Doctor Support",
          features: ["AI Consultation", "Doctor Connection", "Priority Support"],
        },
      ],
      earlyTag: "Early Access",
      earlyTitle: "Get Early Access",
      earlyText: "Join the waitlist and be among the first to access Adamiani.ai.",
      email: "Enter your email",
      join: "Join Waitlist",
    },

    ru: {
      nav: ["Главная", "AI-ассистент", "Видение", "Цены", "О нас"],
      title: "AI слушает. Настоящие врачи отвечают. Решение за вами.",
      description:
        "Не принимайте решение о здоровье в одиночку. Мы превращаем неопределённость в ясность.",
      start: "Следите за нами",
      startSecondary: "Записаться в список",
      cards: ["AI-анализ здоровья", "История здоровья на всю жизнь", "Связь с врачом"],
      previewTitle: "Пример AI-ассистента",
      userMessage: "Последние несколько дней меня часто беспокоят головные боли и усталость.",
      aiMessage:
        "Понимаю. Давайте оценим ваши симптомы, их длительность и факторы риска. При необходимости я помогу связаться с врачом.",
     chatTitle: "Попробуйте ассистента Adamiani.ai",
      chatSubtitle: "Опишите симптомы и получите первичный демо-ответ.",
      chatDemoLabel: "Демо AI-врача",
      chatAssistantName: "Ассистент Adamiani.ai",
      freeQuestionsLabel: "Осталось бесплатных вопросов",
      chatPlaceholder: "Напр.: у меня температура и боль в горле...",
      sendButton: "Отправить",
      chatLimitReached: "Ваши бесплатные вопросы закончились. Выберите план ниже для полного доступа. 👇",
      chatGreeting: "Здравствуйте, я AI-ассистент Adamiani.ai. Опишите, что вас беспокоит, и я помогу с первичной оценкой.",
      chatDemoReply: "Спасибо. Ваши симптомы получены. Это демо-ответ. На следующем этапе здесь будет работать настоящий AI-врач.",
      problemTag: "Проблема",
      problemTitle:
        "Здоровье — ваш самый ценный актив. Разве вы не должны знать, что оно в надёжных руках?",
      problemSubtitle:
        "Сегодня информация о здоровье разрозненна: анализы в одной клинике, заключения в другой, а рекомендации часто теряются.",
      problemStats: [
        { value: "88%", label: "взрослых с трудом понимают медицинскую информацию и ориентируются в системе" },
        { value: "~15 мин", label: "среднее время, которое врач уделяет одному пациенту" },
        { value: "Разрозненно", label: "история здоровья разбросана между клиниками, приложениями и бумагами" },
      ],
      problemSource: "Источник: исследования NIH по медицинской грамотности; данные первичной помощи США",

      visionTag: "Видение",
      visionTitle: "Что мы создаём",
      visionSubtitle:
        "Adamiani.ai — это не просто чат-бот. Это единое пространство для вашего здоровья, построенное в четыре слоя.",
      visionLayers: [
        { title: "Память", text: "Вся история здоровья в одном месте — анализы, диагнозы, лекарства." },
        { title: "Понимание", text: "AI объясняет, что означают ваши данные — простым и понятным языком." },
        { title: "Руководство", text: "Рекомендации о следующем шаге — когда отдохнуть, а когда обратиться к врачу." },
        { title: "Связь", text: "При необходимости — прямой доступ к проверенному врачу, которому можно доверять." },
      ],

      timelineTag: "История здоровья",
      timelineTitle: "Вся история вашего здоровья на одной временной линии",
      timelineSubtitle:
        "Анализы, диагнозы, лекарства, визиты и рекомендации — всё в одном месте на протяжении всей жизни.",
      timelineItems: [
        { year: "2023", title: "Анализ крови" },
        { year: "2024", title: "Визит к кардиологу" },
        { year: "2025", title: "МРТ-исследование" },
        { year: "2026", title: "AI-оценка здоровья" },
      ],

      howTag: "Процесс",
      howTitle: "Как это работает",
      howSubtitle:
        "Adamiani.ai даёт простой путь: собрать информацию о здоровье, получить рекомендации AI и при необходимости связаться с врачом.",
      steps: [
        { title: "Внесите данные", text: "Добавьте симптомы, анализы, лекарства и историю болезни." },
        { title: "Получите оценку AI", text: "AI-ассистент поможет понять риски и выбрать следующий шаг." },
        { title: "Свяжитесь с врачом", text: "При необходимости получите консультацию настоящего врача." },
      ],

      registerTag: "Экосистема",
      registerTitle: "Adamiani.ai создан для каждого",
      registerSubtitle:
        "Для людей, врачей и клиник — единая экосистема здоровья.",
      registerCards: [
        { title: "Пациент", text: "Храните историю здоровья, общайтесь с AI-ассистентом и при необходимости связывайтесь с врачом.", button: "Узнать больше" },
        { title: "Врач", text: "Создайте профиль врача, принимайте пациентов онлайн и используйте поддержку AI.", button: "Узнать больше" },
        { title: "Клиника", text: "Зарегистрируйте клинику, управляйте врачами, пациентами и онлайн-консультациями в одном пространстве.", button: "Узнать больше" },
      ],

      trustTag: "Доверие и безопасность",
      trustTitle: "Ваши данные остаются под вашим контролем",
      storageTitle: "Где хранить ваши данные — выбираете вы",
      storageSubtitle:
        "Мы создаём платформу, где способ хранения данных выбираете вы, а не мы.",
      storageOptions: [
        { icon: "☁️", title: "Безопасное облако", text: "Мы планируем предложить хранение на европейских серверах с надёжным шифрованием." },
        { icon: "💻", title: "Ваше устройство", text: "В будущем вы сможете хранить информацию в виде зашифрованного файла на своём устройстве." },
        { icon: "🔀", title: "Гибрид", text: "Основная копия у вас, а зашифрованная резервная копия в облаке — максимальная гибкость." },
      ],
      storageNote:
        "Эти варианты хранения развиваются — на любом этапе ваши данные зашифрованы и передаются только с вашего разрешения.",
      trustItems: [
        { title: "Зашифрованные записи", text: "Все записи хранятся в зашифрованной среде и принадлежат только пользователю." },
        { title: "Проверенные врачи", text: "Перед допуском на платформу врачи проходят строгую проверку." },
        { title: "AI помогает, а не заменяет", text: "AI не заменяет врача — он помогает человеку лучше понять своё здоровье." },
      ],

      storyTag: "Почему Adamiani",
      storyTitle: "Имя, которое объясняет всё",
      storyText:"Мы выбрали имя «Adamiani» — по-грузински «человек» — потому что именно это потеряла современная медицина. Пациент превратился в номер, диагноз, очередь. Мы хотим, чтобы технологии вернули человека в центр — не заменили врача, а дали каждому время, внимание и понимание.",
      testBadge: "🚧 Тестовый режим — функция пока в разработке",
      footerRights: "Все права защищены.",
      footerPrivacy: "Конфиденциальность",
      footerTerms: "Условия",
      footerContact: "Контакты",
      modalBadge: "БЕСПЛАТНЫЙ ДОСТУП",
      modalTitle: "Зарегистрируйтесь и получите 10 бесплатных AI-ответов",
      modalText: "Заполните данные, чтобы продолжить общение с ассистентом. Это также добавит вас в список раннего доступа.",
      modalNamePlaceholder: "Ваше имя",
      modalButton: "Зарегистрироваться и продолжить",
      rolePatient: "Пациент",
      roleDoctor: "Врач",
      roleClinic: "Клиника",
      journeyTag: "Ваше здоровье",
      journeyTitle: "Начните историю своего здоровья сегодня",
      journeyText: "Храните медицинские записи, получайте рекомендации AI и управляйте здоровьем на протяжении всей жизни.",
      journeyChips: ["История здоровья", "AI-ассистент", "Связь с врачом"],
      journeyButton: "Зарегистрироваться бесплатно",
      pricingTag: "Цены",
      pricingTitle: "Выберите подходящий план",
      pricingSubtitle: "Начните бесплатно и переходите на полную консультацию, когда понадобится.",
      pricingPopular: "Самый популярный",
      pricingSelect: "Выбрать",
      plans: [
        {
          name: "Free",
          price: "$0",
          desc: "Для первого знакомства",
          features: ["10 AI-консультаций в месяц", "Чат с AI-ассистентом", "Первичная оценка"],
        },
        {
          name: "Personal",
          price: "$7 / месяц",
          desc: "Контроль личного здоровья",
          features: ["Безлимитные AI-вопросы", "История здоровья", "Анализ симптомов"],
        },
        {
          name: "Doctor Access",
          price: "$18 / месяц",
          desc: "AI + поддержка врача",
          features: ["AI-консультация", "Связь с врачом", "Приоритетная поддержка"],
        },
      ],
      earlyTag: "Ранний доступ",
      earlyTitle: "Получите ранний доступ",
      earlyText: "Запишитесь в список и станьте одним из первых, кто получит доступ к Adamiani.ai.",
      email: "Введите ваш email",
      join: "Записаться",
    },
  };

  const t = content[language as keyof typeof content] || content.en;
const TestBadge = () => (
    <div className="mb-6 flex justify-center">
      <span className="rounded-full border border-[#D4A574]/40 bg-[#D4A574]/15 px-4 py-2 text-xs font-semibold text-[#B8893F]">
        {t.testBadge}
      </span>
    </div>
  );
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAFAF7] text-[#1A3A5C] scroll-smooth">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.08),_transparent_45%)]" />

      <nav className="fixed left-0 top-0 z-30 flex w-full items-center justify-between border-b border-[#1A3A5C]/5 bg-[#FAFAF7]/80 px-8 py-5 backdrop-blur-md">
        <div className="text-sm font-bold tracking-[0.3em] text-[#1A3A5C]">ADAMIANI.AI</div>

        <div className="hidden items-center gap-8 text-sm font-medium text-[#5A6B7B] md:flex">
          {[
            { label: t.nav[0], href: "#home" },
            { label: t.nav[1], href: "#assistant" },
            { label: t.nav[2], href: "#vision" },
            { label: t.nav[3], href: "#pricing" },
            { label: t.nav[4], href: "#about" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="cursor-pointer transition hover:text-[#1A3A5C]"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex rounded-full border border-[#1A3A5C]/15 bg-white p-1 text-sm">
          <button
            onClick={() => setLanguage("ka")}
            className={`rounded-full px-4 py-2 font-semibold transition ${
              language === "ka" ? "bg-[#1A3A5C] text-white" : "text-[#5A6B7B]"
            }`}
          >
            ქარ
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`rounded-full px-4 py-2 font-semibold transition ${
              language === "en" ? "bg-[#1A3A5C] text-white" : "text-[#5A6B7B]"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("ru")}
            className={`rounded-full px-4 py-2 font-semibold transition ${
              language === "ru" ? "bg-[#1A3A5C] text-white" : "text-[#5A6B7B]"
            }`}
          >
            RU
          </button>
        </div>
      </nav>

     {/* 1. HERO */}
      <section id="home" className="relative z-10 flex min-h-screen items-center justify-center px-6 py-28">
        <div className="grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4A574]/40 bg-[#D4A574]/10 px-5 py-2 text-xs font-semibold tracking-[0.25em] text-[#B8893F]">
              ADAMIANI.AI
            </div>

            <h1 className="text-5xl font-bold leading-[1.1] text-[#1A3A5C] md:text-7xl">
              {t.title}
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5A6B7B]">
              {t.description}
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <button
                onClick={() => document.getElementById("vision")?.scrollIntoView({ behavior: "smooth" })}
                className="group inline-flex items-center gap-2 rounded-full bg-[#1A3A5C] px-8 py-4 font-semibold text-white transition hover:bg-[#15314E]"
              >
                {t.start}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
                className="rounded-full border border-[#1A3A5C]/20 px-8 py-4 font-semibold text-[#1A3A5C] transition hover:bg-[#1A3A5C]/5"
              >
                {t.startSecondary}
              </button>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {[
                { label: t.cards[0], Icon: Brain },
                { label: t.cards[1], Icon: Clock },
                { label: t.cards[2], Icon: Stethoscope },
              ].map(({ label, Icon }) => (
                <div
                  key={label}
                  className="rounded-3xl border border-[#1A3A5C]/10 bg-white p-5 text-left shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A3A5C]/5 text-[#1A3A5C]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#1A3A5C]">{label}</h3>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#1A3A5C]/10 bg-white p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between border-b border-[#1A3A5C]/10 pb-4">
              <div>
                <p className="text-sm font-semibold text-[#1A3A5C]">{t.previewTitle}</p>
                <p className="text-xs text-[#8A97A3]">Adamiani.ai</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-[#D4A574]" />
            </div>

            <div className="space-y-4">
              <div className="ml-auto max-w-[85%] rounded-3xl rounded-tr-sm bg-[#1A3A5C] px-5 py-4 text-sm leading-6 text-white">
                {t.userMessage}
              </div>

              <div className="max-w-[90%] rounded-3xl rounded-tl-sm bg-[#F5ECDD] px-5 py-4 text-sm leading-6 text-[#1A3A5C]">
                {t.aiMessage}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 2. PROBLEM */}
      <section className="relative z-10 px-6 pb-28">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-[#B8893F]">
            {t.problemTag.toUpperCase()}
          </p>

          <h2 className="max-w-4xl text-3xl font-bold leading-snug text-[#1A3A5C] md:text-5xl">
            {t.problemTitle}
          </h2>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5A6B7B]">
            {t.problemSubtitle}
          </p>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {t.problemStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[2rem] border border-[#1A3A5C]/10 bg-white p-8 shadow-sm transition hover:shadow-md"
              >
                <div className="text-5xl font-bold text-[#1A3A5C]">
                  {stat.value}
                </div>

                <p className="mt-4 leading-7 text-[#5A6B7B]">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-[#8A97A3]">{t.problemSource}</p>
        </div>
      </section>
      
     {/* AI CHAT DEMO */}
<section id="assistant" className="relative z-10 px-6 pb-28">
  <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-[#1A3A5C]/10 bg-white p-8 shadow-xl md:p-10">
    <div className="mb-8 text-center">
      <TestBadge />
      <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-[#B8893F]">
        {t.nav[1].toUpperCase()}
      </p>

      <h2 className="text-3xl font-bold text-[#1A3A5C] md:text-5xl">
        {t.chatTitle}
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#5A6B7B]">
        {t.chatSubtitle}
      </p>
    </div>

    <div className="rounded-[2rem] border border-[#1A3A5C]/10 bg-[#FAFAF7] p-5">
      <div className="mb-5 flex items-center justify-between border-b border-[#1A3A5C]/10 pb-4">
        <div>
          <p className="text-sm font-semibold text-[#1A3A5C]">{t.chatDemoLabel}</p>
          <p className="text-xs text-[#8A97A3]">{t.chatAssistantName}</p>
          <p className="mt-1 text-xs font-semibold text-[#B8893F]">
            {t.freeQuestionsLabel}: {freeQuestionsLeft}
          </p>
        </div>

        <div className="h-3 w-3 rounded-full bg-[#D4A574]" />
      </div>

      <div className="h-[320px] space-y-4 overflow-y-auto pr-2">
        <div className="max-w-[90%] rounded-3xl rounded-tl-sm bg-[#F5ECDD] px-5 py-4 text-sm leading-6 text-[#1A3A5C]">
          {t.chatGreeting}
        </div>

        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.role === "user"
                ? "ml-auto max-w-[85%] rounded-3xl rounded-tr-sm bg-[#1A3A5C] px-5 py-4 text-sm leading-6 text-white"
                : "max-w-[90%] rounded-3xl rounded-tl-sm bg-[#F5ECDD] px-5 py-4 text-sm leading-6 text-[#1A3A5C]"
            }
          >
           {msg.text === "..." ? (
              <span className="inline-flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#B8893F] [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#B8893F] [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#B8893F]" />
              </span>
            ) : msg.role === "assistant" ? (
              <div className="markdown-chat space-y-2">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ) : (
              msg.text
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder={t.chatPlaceholder}
          className="h-14 flex-1 rounded-full border border-[#1A3A5C]/15 bg-white px-6 text-[#1A3A5C] outline-none placeholder:text-[#8A97A3]"
        />

        <button
          type="button"
          onClick={sendMessage}
          className="h-14 rounded-full bg-[#1A3A5C] px-8 font-semibold text-white transition hover:bg-[#15314E]"
        >
          {t.sendButton}
        </button>
      </div>
    </div>
  </div>
</section>

     {/* 4. HEALTH TIMELINE */}
      <section id="timeline" className="relative z-10 px-6 pb-28">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-[#B8893F]">
            {t.timelineTag.toUpperCase()}
          </p>

          <h2 className="text-4xl font-bold text-[#1A3A5C] md:text-6xl">
            {t.timelineTitle}
          </h2>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5A6B7B]">
            {t.timelineSubtitle}
          </p>

          <div className="mt-14 space-y-5">
            {t.timelineItems.map((item) => (
              <div
                key={item.year}
                className="flex items-center gap-6 rounded-[2rem] border border-[#1A3A5C]/10 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="rounded-2xl bg-[#1A3A5C] px-5 py-3 font-bold text-white">
                  {item.year}
                </div>

                <h3 className="text-xl font-semibold text-[#1A3A5C]">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="relative z-10 px-6 pb-28">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-[#B8893F]">
            {t.howTag.toUpperCase()}
          </p>

          <h2 className="text-4xl font-bold text-[#1A3A5C] md:text-6xl">{t.howTitle}</h2>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5A6B7B]">
            {t.howSubtitle}
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {t.steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[2rem] border border-[#1A3A5C]/10 bg-white p-7 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1A3A5C] text-lg font-bold text-white">
                  {index + 1}
                </div>

                <h3 className="text-2xl font-semibold text-[#1A3A5C]">{step.title}</h3>

                <p className="mt-4 leading-7 text-[#5A6B7B]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
     {/* PRICING */}
<section id="pricing" className="relative z-10 px-6 pb-28">
  <div className="mx-auto max-w-6xl">
    <div className="mb-12 text-center">
      <TestBadge />
      <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-[#B8893F]">
        {t.pricingTag.toUpperCase()}
      </p>

      <h2 className="text-3xl font-bold text-[#1A3A5C] md:text-5xl">
        {t.pricingTitle}
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#5A6B7B]">
        {t.pricingSubtitle}
      </p>
    </div>

    <div className="grid gap-6 md:grid-cols-3">
      {t.plans.map((plan) => (
        <div
          key={plan.name}
          className={`relative rounded-[2rem] p-8 transition ${
            plan.name === "Personal"
              ? "border-2 border-[#1A3A5C] bg-white shadow-lg"
              : "border border-[#1A3A5C]/10 bg-white shadow-sm hover:shadow-md"
          }`}
        >
          {plan.name === "Personal" && (
            <div className="absolute -top-3 right-6 rounded-full bg-[#D4A574] px-3 py-1 text-xs font-bold text-white">
              {t.pricingPopular}
            </div>
          )}

          <h3 className="text-2xl font-bold text-[#1A3A5C]">{plan.name}</h3>
          <p className="mt-2 text-[#5A6B7B]">{plan.desc}</p>

          <div className="mt-6 text-4xl font-bold text-[#1A3A5C]">
            {plan.price}
          </div>

          <ul className="mt-8 space-y-4 text-[#5A6B7B]">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <span className="mt-0.5 text-[#D4A574]">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button
            disabled
            className={`mt-8 h-12 w-full rounded-full font-semibold transition opacity-50 cursor-not-allowed ${
              plan.name === "Personal"
                ? "bg-[#1A3A5C] text-white"
                : "border border-[#1A3A5C]/20 text-[#1A3A5C]"
            }`}
          >
            {t.pricingSelect}
          </button>
        </div>
      ))}
    </div>
  </div>
</section>
{/* START YOUR HEALTH JOURNEY */}
      <section className="relative z-10 px-6 pb-28">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-[#1A3A5C] p-10 text-center md:p-16">

          <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-[#D4A574]">
            {t.journeyTag.toUpperCase()}
          </p>

          <h2 className="text-4xl font-bold text-white md:text-6xl">
            {t.journeyTitle}
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/70">
            {t.journeyText}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {t.journeyChips.map((chip) => (
              <div
                key={chip}
                className="rounded-full border border-white/20 px-5 py-3 text-sm text-white"
              >
                {chip}
              </div>
            ))}
          </div>

          <button
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-10 rounded-full bg-[#D4A574] px-10 py-5 text-lg font-semibold text-white transition hover:bg-[#C4955F]"
          >
            {t.journeyButton}
          </button>

        </div>
      </section>

      {/* 7. TRUST */}
      <section className="relative z-10 px-6 pb-28">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-[#1A3A5C]/10 bg-white p-10 shadow-sm md:p-14">
          <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-[#B8893F]">
            {t.trustTag.toUpperCase()}
          </p>

          <h2 className="text-4xl font-bold text-[#1A3A5C] md:text-6xl">{t.trustTitle}</h2>

          <div className="mt-14 rounded-[2rem] border border-[#D4A574]/30 bg-[#F5ECDD]/40 p-8 md:p-10">
          <TestBadge />
            <h3 className="text-2xl font-semibold text-[#1A3A5C] md:text-3xl">
              {t.storageTitle}
            </h3>

            <p className="mt-4 max-w-3xl leading-8 text-[#5A6B7B]">
              {t.storageSubtitle}
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {t.storageOptions.map((opt) => (
                <div
                  key={opt.title}
                  className="rounded-[2rem] border border-[#1A3A5C]/10 bg-white p-7 shadow-sm"
                >
                  <div className="text-3xl">{opt.icon}</div>

                  <h4 className="mt-4 text-xl font-semibold text-[#1A3A5C]">{opt.title}</h4>

                  <p className="mt-3 leading-7 text-[#5A6B7B]">{opt.text}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm leading-6 text-[#8A97A3]">
              {t.storageNote}
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {t.trustItems.map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-[#1A3A5C]/10 bg-[#FAFAF7] p-7"
              >
                <h3 className="text-xl font-semibold text-[#1A3A5C]">{item.title}</h3>

                <p className="mt-4 leading-7 text-[#5A6B7B]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. STORY */}
      <section id="about" className="relative z-10 px-6 pb-28">
        <div className="mx-auto max-w-4xl rounded-[2.5rem] border border-[#1A3A5C]/10 bg-white p-10 shadow-sm md:p-14">
          <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-[#B8893F]">
            {t.storyTag.toUpperCase()}
          </p>

          <h2 className="text-3xl font-bold text-[#1A3A5C] md:text-5xl">{t.storyTitle}</h2>

          <p className="mt-7 text-lg leading-9 text-[#5A6B7B]">
            {t.storyText}
          </p>
        </div>
      </section>

      {/* 9. WAITLIST */}
      <section id="waitlist" className="relative z-10 px-6 pb-32">
        <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-[#1A3A5C] p-10 text-center md:p-14">
          <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-[#D4A574]">
            {t.earlyTag.toUpperCase()}
          </p>

          <h2 className="text-4xl font-bold text-white md:text-6xl">{t.earlyTitle}</h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
            {t.earlyText}
          </p>

          <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-4">
            
            <input
           type="text"
           value={name}
           onChange={(e) => setName(e.target.value)}
           placeholder={language === "ka" ? "თქვენი სახელი" : "Your name"}
           className="h-16 flex-1 rounded-full border border-white/20 bg-white/10 px-8 text-lg text-white outline-none placeholder:text-white/50 focus:border-[#D4A574]"
          />
            <input
             type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             placeholder={t.email}
             className="h-16 flex-1 rounded-full border border-white/20 bg-white/10 px-8 text-lg text-white outline-none placeholder:text-white/50 focus:border-[#D4A574]"
          />
          <div className="flex flex-wrap justify-center gap-3 mt-2">

  <button
    type="button"
    onClick={() => setRole("patient")}
    className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
      role === "patient"
        ? "bg-[#D4A574] text-white"
        : "bg-white/10 text-white hover:bg-white/20"
    }`}
  >
    {t.rolePatient}
  </button>

  <button
    type="button"
    onClick={() => setRole("doctor")}
    className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
      role === "doctor"
        ? "bg-[#D4A574] text-white"
        : "bg-white/10 text-white hover:bg-white/20"
    }`}
  >
    {t.roleDoctor}
  </button>

  <button
    type="button"
    onClick={() => setRole("clinic")}
    className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
      role === "clinic"
        ? "bg-[#D4A574] text-white"
        : "bg-white/10 text-white hover:bg-white/20"
    }`}
  >
    {t.roleClinic}
  </button>

</div>

            <button
             onClick={saveEmail}
            className="h-14 rounded-full bg-[#D4A574] px-8 font-semibold text-white transition hover:bg-[#C4955F]"
               >
            {t.join}
            </button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#1A3A5C]/10 px-8 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-[#8A97A3] md:flex-row md:items-center md:justify-between">
          <p>© 2026 Adamiani.ai. {t.footerRights}</p>

          <div className="flex gap-6">
            <span className="cursor-pointer transition hover:text-[#1A3A5C]">{t.footerPrivacy}</span>
            <span className="cursor-pointer transition hover:text-[#1A3A5C]">{t.footerTerms}</span>
            <span className="cursor-pointer transition hover:text-[#1A3A5C]">{t.footerContact}</span>
          </div>
        </div>
      </footer>

      {/* REGISTRATION MODAL (popup) */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* dark overlay */}
          <div
            className="absolute inset-0 bg-[#1A3A5C]/40 backdrop-blur-sm"
            onClick={() => setShowRegisterModal(false)}
          />

          {/* modal card */}
          <div className="relative z-10 w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl md:p-10">
            <button
              type="button"
              onClick={() => setShowRegisterModal(false)}
              className="absolute right-5 top-5 text-[#8A97A3] transition hover:text-[#1A3A5C]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#D4A574]/40 bg-[#D4A574]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#B8893F]">
              {t.modalBadge}
            </div>

            <h3 className="mt-3 text-2xl font-bold text-[#1A3A5C]">
              {t.modalTitle}
            </h3>

           <p className="mt-3 text-sm leading-6 text-[#5A6B7B]">
            {t.modalText}
          </p>

            <div className="mt-6 flex flex-col gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.modalNamePlaceholder}
                className="h-13 rounded-full border border-[#1A3A5C]/15 bg-[#FAFAF7] px-6 py-3.5 text-[#1A3A5C] outline-none placeholder:text-[#8A97A3] focus:border-[#D4A574]"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.email}
                className="h-13 rounded-full border border-[#1A3A5C]/15 bg-[#FAFAF7] px-6 py-3.5 text-[#1A3A5C] outline-none placeholder:text-[#8A97A3] focus:border-[#D4A574]"
              />

              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setRole("patient")}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    role === "patient"
                      ? "bg-[#1A3A5C] text-white"
                      : "bg-[#1A3A5C]/5 text-[#5A6B7B] hover:bg-[#1A3A5C]/10"
                  }`}
                >
                  {t.rolePatient}

                </button>

                <button
                  type="button"
                  onClick={() => setRole("doctor")}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    role === "doctor"
                      ? "bg-[#1A3A5C] text-white"
                      : "bg-[#1A3A5C]/5 text-[#5A6B7B] hover:bg-[#1A3A5C]/10"
                  }`}
                >
                  {t.roleDoctor}
                </button>

                <button
                  type="button"
                  onClick={() => setRole("clinic")}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    role === "clinic"
                      ? "bg-[#1A3A5C] text-white"
                      : "bg-[#1A3A5C]/5 text-[#5A6B7B] hover:bg-[#1A3A5C]/10"
                  }`}
                >
                  {t.roleClinic}
                </button>
              </div>

              <button
                type="button"
                onClick={saveEmail}
                className="mt-2 h-13 rounded-full bg-[#D4A574] px-8 py-3.5 font-semibold text-white transition hover:bg-[#C4955F]"
              >
                {t.modalButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}