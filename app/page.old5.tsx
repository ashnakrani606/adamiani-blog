"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ClipboardCheck,
  FileText,
  HeartPulse,
  Hospital,
  Languages,
  LockKeyhole,
  Plane,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";

type Lang = "ka" | "en" | "ru";
type Role = "patient" | "doctor" | "clinic";
type ChatMessage = { role: "user" | "assistant"; text: string };

const FREE_LIMIT = 10;

const content = {
  ka: {
    nav: ["როგორ მუშაობს", "Health Passport", "კლინიკები", "ნდობა", "ადრეული წვდომა"],
    heroBadge: "CROSS-BORDER HEALTHCARE",
    title: "მკურნალობა საზღვრებს მიღმა — უფრო უსაფრთხოდ, ორგანიზებულად და გასაგებად.",
    description:
      "Adamiani.ai გეხმარებათ ატვირთოთ თქვენი სამედიცინო შემთხვევა, მიიღოთ კლინიკების ვარიანტები და შეინახოთ მთელი ჯანმრთელობის ისტორია ერთ Health Passport-ში — მკურნალობამდე, მკურნალობის დროს და შემდეგ.",
    primaryCta: "მიიღე მკურნალობის ვარიანტები",
    secondaryCta: "შექმენი უფასო Health Passport",
    heroCards: [
      "ატვირთე ანალიზები და დასკვნები",
      "მიიღე კლინიკების შეთავაზებები",
      "შეინახე ისტორია ერთ სივრცეში",
    ],
    journeyTitle: "პაციენტის გზა Adamiani.ai-ში",
    journeySteps: [
      { title: "ატვირთე შემთხვევა", text: "ანალიზები, MRI, დიაგნოზი, ექიმის დასკვნა ან ფოტო." },
      { title: "მივიღებთ და დავალაგებთ", text: "AI ამზადებს მოკლე Case Summary-ს და სამედიცინო ქრონოლოგიას." },
      { title: "შეადარე ვარიანტები", text: "მიიღე შესაბამისი კლინიკების პასუხები, გეგმა და სავარაუდო ფასი." },
      { title: "გააგრძელე მკურნალობა", text: "Health Passport ინახავს ისტორიას და გეხმარება follow-up-ში." },
    ],
    problemTag: "პრობლემა",
    problemTitle: "მკურნალობა არ მთავრდება კლინიკიდან გამოსვლის შემდეგ.",
    problemText:
      "საზღვარგარეთ მკურნალობისას პაციენტის დოკუმენტები ხშირად იფანტება: ნაწილი ერთ კლინიკაშია, ნაწილი PDF-ში, ნაწილი თარგმანში იკარგება. შემდეგ, როცა პაციენტი სახლში ბრუნდება, ადგილობრივ ექიმს სრული სურათი აღარ აქვს.",
    problemItems: ["დაკარგული ანალიზები", "გაფანტული დასკვნები", "უცხო ენაზე დოკუმენტები", "რთული follow-up"],
    passportTag: "HEALTH PASSPORT",
    passportTitle: "ერთი სამედიცინო ისტორია. ნებისმიერ ქვეყანაში.",
    passportText:
      "Adamiani Health Passport არის თქვენი სამედიცინო ისტორიის ციფრული სივრცე: ანალიზები, დიაგნოზები, მედიკამენტები, ოპერაციები, ექიმების რეკომენდაციები და AI Summary — ყველაფერი ერთ ქრონოლოგიურ ხაზზე.",
    passportItems: [
      { year: "Step 1", title: "Documents Vault", text: "PDF, ფოტო, ლაბორატორიული ანალიზი და ექიმის დასკვნა ერთ სივრცეში." },
      { year: "Step 2", title: "Medical Timeline", text: "ყველა მნიშვნელოვანი მოვლენა ქრონოლოგიურად დალაგებული." },
      { year: "Step 3", title: "AI Summary", text: "ექიმისთვის გასაგები მოკლე შეჯამება სხვადასხვა ენაზე." },
      { year: "Step 4", title: "Share With Doctor", text: "გააზიარე ინფორმაცია მხოლოდ მაშინ, როცა შენ აირჩევ." },
    ],
    clinicTag: "კლინიკებთან დაკავშირება",
    clinicTitle: "არა უბრალოდ კლინიკის პოვნა — არამედ სწორი გადაწყვეტილების მიღება.",
    clinicText:
      "პაციენტი ტოვებს შემთხვევას. Adamiani აწყობს დოკუმენტებს, ამზადებს Case Package-ს და აგზავნის შესაბამის პარტნიორ კლინიკებთან. კლინიკა პასუხობს მკურნალობის ვარიანტით — პაციენტი ადარებს და არჩევს.",
    clinicCards: [
      { title: "Qualified Case", text: "კლინიკა იღებს დალაგებულ შემთხვევას, არა ცივ ლიდს." },
      { title: "Clinic Options", text: "პაციენტს შეუძლია შეადაროს სხვადასხვა კლინიკის პასუხი." },
      { title: "Continuity Layer", text: "მკურნალობის შემდეგ პაციენტი Adamiani Health Passport-ში რჩება." },
    ],
    assistantTag: "AI SUPPORT",
    assistantTitle: "AI ეხმარება, ექიმს არ ცვლის.",
    assistantText:
      "ასისტენტი გამოიყენება სიმპტომების პირველადი დალაგებისთვის, დოკუმენტების შეჯამებისთვის და მომდევნო ნაბიჯის უკეთ გასაგებად. სამედიცინო გადაწყვეტილებას იღებს პაციენტი ექიმთან ერთად.",
    chatTitle: "სცადე Adamiani.ai ასისტენტი",
    chatSubtitle: "აღწერე სიმპტომები ან სამედიცინო კითხვა და მიიღე დემო პასუხი.",
    chatDemoLabel: "AI ასისტენტის დემო",
    chatAssistantName: "Adamiani.ai Assistant",
    freeQuestionsLabel: "დარჩენილი უფასო კითხვები",
    chatPlaceholder: "მაგ: მაქვს MRI პასუხი და მინდა გავიგო შემდეგი ნაბიჯი...",
    sendButton: "გაგზავნა",
    chatGreeting:
      "გამარჯობა, მე ვარ Adamiani.ai ასისტენტი. შემიძლია დაგეხმაროთ თქვენი შემთხვევის დალაგებაში, მაგრამ ექიმს არ ვცვლი.",
    chatLimitReached: "უფასო კითხვები ამოიწურა. გააგრძელეთ რეგისტრაციით ან დაგვიტოვეთ მოთხოვნა. 👇",
    chatDemoReply:
      "მადლობა. ეს არის დემო პასუხი. რეალურ ვერსიაში Adamiani.ai დაგეხმარებათ ინფორმაციის დალაგებაში და ექიმთან ან კლინიკასთან მომზადებულ კომუნიკაციაში.",
    trustTag: "ნდობა და უსაფრთხოება",
    trustTitle: "ჯანმრთელობის მონაცემები მხოლოდ თქვენი კონტროლის ქვეშ უნდა იყოს.",
    trustItems: [
      { title: "Patient-Controlled", text: "თქვენ წყვეტთ, ვის გაუზიაროთ ჩანაწერები და როდის." },
      { title: "Privacy by Design", text: "უსაფრთხოება და კონფიდენციალურობა ჩადებულია სისტემის არქიტექტურაში." },
      { title: "Verified Partners", text: "კლინიკებისა და ექიმების დამატება ხდება შემოწმების პროცესით." },
      { title: "No AI Diagnosis Promise", text: "AI არ ცვლის ექიმს და არ არის საბოლოო დიაგნოზის ინსტრუმენტი." },
    ],
    accessTag: "ადრეული წვდომა",
    accessTitle: "დატოვე მოთხოვნა და მიიღე Adamiani Health Passport-ის ადრეული წვდომა.",
    accessText:
      "დარეგისტრირდი როგორც პაციენტი, ექიმი ან კლინიკა. პირველ ეტაპზე ვაგროვებთ რეალურ შემთხვევებს და პარტნიორებს cross-border healthcare corridor-ისთვის.",
    email: "ელფოსტა",
    name: "სახელი",
    join: "დარეგისტრირება",
    rolePatient: "პაციენტი",
    roleDoctor: "ექიმი",
    roleClinic: "კლინიკა",
    modalBadge: "უფასო წვდომა",
    modalTitle: "დარეგისტრირდი და გააგრძელე ასისტენტთან საუბარი",
    modalText: "შეავსე მონაცემები. ეს ასევე დაგამატებს ადრეული წვდომის სიაში.",
    modalButton: "რეგისტრაცია და გაგრძელება",
    fillAll: "შეავსეთ ყველა ველი",
    error: "დაფიქსირდა შეცდომა",
    success: "დარეგისტრირება შესრულდა",
    footerRights: "ყველა უფლება დაცულია.",
  },
  en: {
    nav: ["How it works", "Health Passport", "Clinics", "Trust", "Early Access"],
    heroBadge: "CROSS-BORDER HEALTHCARE",
    title: "Healthcare across borders — safer, organized and easier to understand.",
    description:
      "Adamiani.ai helps patients upload their medical case, receive treatment options from trusted clinics, and keep their entire health history in one Health Passport — before, during and after treatment.",
    primaryCta: "Get Treatment Options",
    secondaryCta: "Create Free Health Passport",
    heroCards: ["Upload records", "Receive clinic options", "Keep your history in one place"],
    journeyTitle: "The Adamiani patient journey",
    journeySteps: [
      { title: "Upload your case", text: "Labs, MRI, diagnosis, doctor report or medical photos." },
      { title: "We organize it", text: "AI creates a clear case summary and medical timeline." },
      { title: "Compare options", text: "Receive clinic responses, treatment plans and estimated pricing." },
      { title: "Continue care", text: "Your Health Passport supports follow-up after treatment." },
    ],
    problemTag: "The Problem",
    problemTitle: "Treatment doesn't end when you leave the hospital.",
    problemText:
      "In cross-border healthcare, records are often scattered across clinics, PDFs, translations and paper. When patients return home, local doctors may not have the full picture.",
    problemItems: ["Lost lab results", "Scattered reports", "Language barriers", "Difficult follow-up"],
    passportTag: "HEALTH PASSPORT",
    passportTitle: "One medical history. Anywhere in the world.",
    passportText:
      "Adamiani Health Passport is a digital space for your medical history: labs, diagnoses, medications, procedures, doctor recommendations and AI summaries — organized in one timeline.",
    passportItems: [
      { year: "Step 1", title: "Documents Vault", text: "PDFs, photos, lab results and reports in one secure space." },
      { year: "Step 2", title: "Medical Timeline", text: "Every important medical event organized chronologically." },
      { year: "Step 3", title: "AI Summary", text: "Clear summaries that help doctors understand your case faster." },
      { year: "Step 4", title: "Share With Doctor", text: "Share records only when you choose." },
    ],
    clinicTag: "Clinic Matching",
    clinicTitle: "Not just finding a clinic — making the right treatment decision.",
    clinicText:
      "Patients submit a case. Adamiani organizes the documents, prepares a case package and sends it to relevant partner clinics. Clinics respond with treatment options — patients compare and choose.",
    clinicCards: [
      { title: "Qualified Case", text: "Clinics receive organized cases, not cold leads." },
      { title: "Clinic Options", text: "Patients can compare responses from multiple providers." },
      { title: "Continuity Layer", text: "After treatment, the patient stays inside Adamiani Health Passport." },
    ],
    assistantTag: "AI SUPPORT",
    assistantTitle: "AI assists. It does not replace doctors.",
    assistantText:
      "The assistant is used to organize symptoms, summarize documents and help patients understand the next step. Medical decisions should be made with qualified clinicians.",
    chatTitle: "Try Adamiani.ai Assistant",
    chatSubtitle: "Describe a symptom or medical question and get a demo response.",
    chatDemoLabel: "AI Assistant Demo",
    chatAssistantName: "Adamiani.ai Assistant",
    freeQuestionsLabel: "Free questions remaining",
    chatPlaceholder: "e.g. I have an MRI report and need to understand the next step...",
    sendButton: "Send",
    chatGreeting:
      "Hello, I am the Adamiani.ai assistant. I can help organize your case, but I do not replace a doctor.",
    chatLimitReached: "You've used all your free questions. Register or leave a request to continue. 👇",
    chatDemoReply:
      "Thank you. This is a demo response. In the real product, Adamiani.ai helps organize your information and prepare communication with doctors or clinics.",
    trustTag: "Trust & Security",
    trustTitle: "Your health data should stay under your control.",
    trustItems: [
      { title: "Patient-Controlled", text: "You decide who can access your records and when." },
      { title: "Privacy by Design", text: "Security and privacy are built into the architecture from the start." },
      { title: "Verified Partners", text: "Clinics and doctors are added through a verification process." },
      { title: "No AI Diagnosis Promise", text: "AI does not replace doctors and is not a final diagnosis tool." },
    ],
    accessTag: "Early Access",
    accessTitle: "Leave a request and get early access to Adamiani Health Passport.",
    accessText:
      "Register as a patient, doctor or clinic. In the first phase, we are collecting real cases and partners for the cross-border healthcare corridor.",
    email: "Email",
    name: "Your name",
    join: "Join Early Access",
    rolePatient: "Patient",
    roleDoctor: "Doctor",
    roleClinic: "Clinic",
    modalBadge: "FREE ACCESS",
    modalTitle: "Register and continue with the assistant",
    modalText: "Fill in your details. This also adds you to the early access list.",
    modalButton: "Register & Continue",
    fillAll: "Please fill in all fields",
    error: "An error occurred",
    success: "Registration completed",
    footerRights: "All rights reserved.",
  },
  ru: {
    nav: ["Как работает", "Health Passport", "Клиники", "Доверие", "Ранний доступ"],
    heroBadge: "CROSS-BORDER HEALTHCARE",
    title: "Лечение за границей — безопаснее, понятнее и организованнее.",
    description:
      "Adamiani.ai помогает пациентам загрузить медицинский случай, получить варианты лечения от проверенных клиник и сохранить всю историю здоровья в одном Health Passport — до, во время и после лечения.",
    primaryCta: "Получить варианты лечения",
    secondaryCta: "Создать бесплатный Health Passport",
    heroCards: ["Загрузите документы", "Получите варианты клиник", "Сохраните историю в одном месте"],
    journeyTitle: "Путь пациента в Adamiani",
    journeySteps: [
      { title: "Загрузите случай", text: "Анализы, МРТ, диагноз, заключение врача или фото документов." },
      { title: "Мы структурируем", text: "AI создаёт краткое резюме случая и медицинскую хронологию." },
      { title: "Сравните варианты", text: "Получите ответы клиник, планы лечения и ориентировочную стоимость." },
      { title: "Продолжайте лечение", text: "Health Passport помогает с follow-up после лечения." },
    ],
    problemTag: "Проблема",
    problemTitle: "Лечение не заканчивается после выхода из больницы.",
    problemText:
      "В международном лечении документы часто разбросаны между клиниками, PDF, переводами и бумагами. Когда пациент возвращается домой, местный врач не всегда видит полную картину.",
    problemItems: ["Потерянные анализы", "Разрозненные заключения", "Языковые барьеры", "Сложный follow-up"],
    passportTag: "HEALTH PASSPORT",
    passportTitle: "Одна медицинская история. В любой стране.",
    passportText:
      "Adamiani Health Passport — это цифровое пространство для вашей медицинской истории: анализы, диагнозы, лекарства, процедуры, рекомендации врачей и AI-резюме — всё в одной хронологии.",
    passportItems: [
      { year: "Шаг 1", title: "Documents Vault", text: "PDF, фото, анализы и заключения в одном защищённом пространстве." },
      { year: "Шаг 2", title: "Medical Timeline", text: "Все важные события расположены в хронологическом порядке." },
      { year: "Шаг 3", title: "AI Summary", text: "Краткие резюме, которые помогают врачу быстрее понять случай." },
      { year: "Шаг 4", title: "Share With Doctor", text: "Делитесь записями только тогда, когда сами решите." },
    ],
    clinicTag: "Подбор клиник",
    clinicTitle: "Не просто найти клинику — а принять правильное решение о лечении.",
    clinicText:
      "Пациент оставляет случай. Adamiani структурирует документы, готовит case package и отправляет его подходящим партнёрским клиникам. Клиники отвечают вариантами лечения — пациент сравнивает и выбирает.",
    clinicCards: [
      { title: "Qualified Case", text: "Клиники получают структурированный случай, а не холодный лид." },
      { title: "Clinic Options", text: "Пациент сравнивает ответы нескольких провайдеров." },
      { title: "Continuity Layer", text: "После лечения пациент остаётся в Adamiani Health Passport." },
    ],
    assistantTag: "AI SUPPORT",
    assistantTitle: "AI помогает, но не заменяет врачей.",
    assistantText:
      "Ассистент помогает структурировать симптомы, резюмировать документы и понять следующий шаг. Медицинские решения принимаются вместе с квалифицированным врачом.",
    chatTitle: "Попробуйте ассистента Adamiani.ai",
    chatSubtitle: "Опишите симптом или медицинский вопрос и получите демо-ответ.",
    chatDemoLabel: "Демо AI-ассистента",
    chatAssistantName: "Adamiani.ai Assistant",
    freeQuestionsLabel: "Осталось бесплатных вопросов",
    chatPlaceholder: "Напр.: у меня есть МРТ и я хочу понять следующий шаг...",
    sendButton: "Отправить",
    chatGreeting:
      "Здравствуйте, я ассистент Adamiani.ai. Я могу помочь структурировать ваш случай, но не заменяю врача.",
    chatLimitReached: "Бесплатные вопросы закончились. Зарегистрируйтесь или оставьте заявку, чтобы продолжить. 👇",
    chatDemoReply:
      "Спасибо. Это демо-ответ. В реальном продукте Adamiani.ai поможет структурировать информацию и подготовить коммуникацию с врачами или клиниками.",
    trustTag: "Доверие и безопасность",
    trustTitle: "Ваши медицинские данные должны оставаться под вашим контролем.",
    trustItems: [
      { title: "Patient-Controlled", text: "Вы решаете, кто и когда получит доступ к вашим записям." },
      { title: "Privacy by Design", text: "Безопасность и конфиденциальность заложены в архитектуру с самого начала." },
      { title: "Verified Partners", text: "Клиники и врачи добавляются через процесс проверки." },
      { title: "No AI Diagnosis Promise", text: "AI не заменяет врача и не является инструментом финального диагноза." },
    ],
    accessTag: "Ранний доступ",
    accessTitle: "Оставьте заявку и получите ранний доступ к Adamiani Health Passport.",
    accessText:
      "Зарегистрируйтесь как пациент, врач или клиника. На первом этапе мы собираем реальные случаи и партнёров для cross-border healthcare corridor.",
    email: "Email",
    name: "Ваше имя",
    join: "Получить ранний доступ",
    rolePatient: "Пациент",
    roleDoctor: "Врач",
    roleClinic: "Клиника",
    modalBadge: "БЕСПЛАТНЫЙ ДОСТУП",
    modalTitle: "Зарегистрируйтесь и продолжите с ассистентом",
    modalText: "Заполните данные. Это также добавит вас в список раннего доступа.",
    modalButton: "Зарегистрироваться и продолжить",
    fillAll: "Заполните все поля",
    error: "Произошла ошибка",
    success: "Регистрация завершена",
    footerRights: "Все права защищены.",
  },
} as const;

export default function Home() {
  const [language, setLanguage] = useState<Lang>("ka");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("patient");
  const [message, setMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [freeQuestionsLeft, setFreeQuestionsLeft] = useState(FREE_LIMIT);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const t = content[language];

  useEffect(() => {
    const saved = localStorage.getItem("adamiani_registered");
    if (saved === "true") setIsRegistered(true);

    const savedQuestions = localStorage.getItem("adamiani_questions_left");
    if (savedQuestions !== null) {
      const parsed = Number.parseInt(savedQuestions, 10);
      if (!Number.isNaN(parsed)) setFreeQuestionsLeft(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("adamiani_questions_left", String(freeQuestionsLeft));
  }, [freeQuestionsLeft]);

  useEffect(() => {
    const container = chatEndRef.current?.parentElement;
    if (container) container.scrollTop = container.scrollHeight;
  }, [chatMessages]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const saveEmail = async () => {
    if (!name.trim() || !email.trim()) {
      alert(t.fillAll);
      return;
    }

    const { error } = await supabase.from("waitlist").insert([
      {
        name: name.trim(),
        email: email.trim(),
        role,
        user_type: role,
        source: "adamiani_cross_border_homepage",
      },
    ]);

    if (error && error.code !== "23505") {
      console.error(error);
      alert(t.error);
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
      setChatMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg?.text === t.chatLimitReached) return prev;
        return [...prev, { role: "assistant", text: t.chatLimitReached }];
      });
      setTimeout(() => scrollTo("waitlist"), 1200);
      return;
    }

    const userMessage = message.trim();
    setMessage("");
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
      { role: "assistant", text: "..." },
    ]);
    setFreeQuestionsLeft((prev) => prev - 1);

    try {
      const conversation = [
        ...chatMessages.map((m) => ({ role: m.role, content: m.text })),
        { role: "user", content: userMessage },
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation, language }),
      });

      const data = await res.json();
      const reply = data.reply || t.chatDemoReply;

      setChatMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", text: reply };
        return updated;
      });
    } catch (error) {
      console.error(error);
      setChatMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", text: t.chatDemoReply };
        return updated;
      });
    }
  };

  const RoleButton = ({ value, label, dark = false }: { value: Role; label: string; dark?: boolean }) => (
    <button
      type="button"
      onClick={() => setRole(value)}
      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
        role === value
          ? "bg-[#38BDF8] text-white"
          : dark
            ? "bg-white/10 text-white hover:bg-white/20"
            : "bg-[#EAF5FF] text-[#50677F] hover:bg-[#EAF5FF]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F5FAFF] text-[#062A4F] scroll-smooth">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(14,165,164,0.12),_transparent_30%),linear-gradient(180deg,_#F5FAFF_0%,_#FFFFFF_45%,_#F5FAFF_100%)]" />

      <nav className="fixed left-0 top-0 z-30 flex w-full items-center justify-between border-b border-[#DCEAF7] bg-[#F5FAFF]/85 px-6 py-4 backdrop-blur-md md:px-8">
        <button onClick={() => scrollTo("home")} className="text-xs font-bold tracking-[0.35em] text-[#062A4F] md:text-sm">
          ADAMIANI.AI
        </button>

        <div className="hidden items-center gap-7 text-sm font-medium text-[#50677F] lg:flex">
          {[
            { label: t.nav[0], href: "journey" },
            { label: t.nav[1], href: "passport" },
            { label: t.nav[2], href: "clinics" },
            { label: t.nav[3], href: "trust" },
            { label: t.nav[4], href: "waitlist" },
          ].map((item) => (
            <button key={item.href} onClick={() => scrollTo(item.href)} className="transition hover:text-[#062A4F]">
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex rounded-full border border-[#DCEAF7] bg-white p-1 text-xs md:text-sm">
          {(["ka", "en", "ru"] as Lang[]).map((lng) => (
            <button
              key={lng}
              onClick={() => setLanguage(lng)}
              className={`rounded-full px-3 py-2 font-semibold transition md:px-4 ${
                language === lng ? "bg-[#062A4F] text-white" : "text-[#50677F]"
              }`}
            >
              {lng === "ka" ? "ქარ" : lng.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      <section id="home" className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-20 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid max-w-6xl items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]"
        >
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#38BDF8]/40 bg-[#38BDF8]/10 px-5 py-2 text-xs font-semibold tracking-[0.25em] text-[#0EA5A4]">
              {t.heroBadge}
            </div>
            <h1 className="text-4xl font-bold leading-[1.08] text-[#062A4F] md:text-6xl lg:text-7xl">{t.title}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#50677F]">{t.description}</p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollTo("waitlist")}
                className="group inline-flex items-center gap-2 rounded-full bg-[#0B63F6] px-8 py-4 font-semibold text-white transition hover:bg-[#084FC7]"
              >
                {t.primaryCta}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </motion.button>
              <button
                onClick={() => scrollTo("passport")}
                className="rounded-full border border-[#BFD7EA] bg-white px-8 py-4 font-semibold text-[#062A4F] transition hover:bg-[#EAF5FF]"
              >
                {t.secondaryCta}
              </button>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {[
                { label: t.heroCards[0], Icon: FileText },
                { label: t.heroCards[1], Icon: Hospital },
                { label: t.heroCards[2], Icon: HeartPulse },
              ].map(({ label, Icon }) => (
                <div key={label} className="rounded-3xl border border-[#DCEAF7] bg-white p-5 text-left shadow-[0_18px_50px_rgba(6,42,79,0.08)]">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF5FF] text-[#0B63F6]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#062A4F]">{label}</h3>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* globe glow background */}
            <div className="pointer-events-none absolute -inset-24 z-0 hidden items-center justify-center lg:flex">
              <div className="relative h-[520px] w-[520px] rounded-full border-2 border-[#BFD7EA] bg-[radial-gradient(circle,_rgba(56,189,248,0.45)_0%,_rgba(14,165,164,0.18)_40%,_rgba(245,250,255,0)_70%)]">
                <div className="absolute inset-[12%] rounded-full border border-[#38BDF8]/30" />
                <div className="absolute inset-[26%] rounded-full border border-[#38BDF8]/25" />
                <div className="absolute inset-[40%] rounded-full border border-[#38BDF8]/20" />
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#38BDF8]/20" />
                <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#38BDF8]/20" />
              </div>
            </div>

            {/* dotted travel route */}
            <div className="absolute left-[18%] top-[44%] hidden h-px w-[64%] border-t border-dashed border-[#38BDF8]/50 lg:block" />

            {/* floating country card — top right */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 -top-6 z-20 hidden items-center gap-2 rounded-2xl border border-[#DCEAF7] bg-white px-4 py-2.5 shadow-[0_18px_50px_rgba(6,42,79,0.08)] lg:flex"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF5FF] text-[#0B63F6]">
                <Hospital className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-[#062A4F]">Turkey</span>
            </motion.div>

            {/* floating country card — bottom left */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-5 -left-4 z-20 hidden items-center gap-2 rounded-2xl border border-[#DCEAF7] bg-white px-4 py-2.5 shadow-[0_18px_50px_rgba(6,42,79,0.08)] lg:flex"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF5FF] text-[#0EA5A4]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-[#062A4F]">Germany</span>
            </motion.div>

            {/* floating country card — bottom right */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 right-6 z-20 hidden items-center gap-2 rounded-2xl border border-[#DCEAF7] bg-white px-4 py-2.5 shadow-[0_18px_50px_rgba(6,42,79,0.08)] lg:flex"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF5FF] text-[#0B63F6]">
                <Plane className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-[#062A4F]">UAE</span>
            </motion.div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 rounded-[2rem] border border-[#DCEAF7] bg-white p-6 shadow-[0_28px_80px_rgba(6,42,79,0.14)]"
          >
            <div className="mb-6 flex items-center justify-between border-b border-[#DCEAF7] pb-5">
              <div>
                <p className="text-sm font-semibold text-[#062A4F]">Adamiani Care Corridor</p>
                <p className="text-xs text-[#7A8FA5]">Case package preview</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-[#38BDF8]" />
            </div>

            <div className="space-y-4">
              {[
                { icon: FileText, title: t.journeySteps[0].title, text: t.journeySteps[0].text },
                { icon: Languages, title: t.journeySteps[1].title, text: t.journeySteps[1].text },
                { icon: Hospital, title: t.journeySteps[2].title, text: t.journeySteps[2].text },
                { icon: Plane, title: t.journeySteps[3].title, text: t.journeySteps[3].text },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4 rounded-3xl bg-[#F5FAFF] p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#062A4F] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#062A4F]">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#50677F]">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          </div>
        </motion.div>
      </section>

      <section id="journey" className="relative z-10 px-6 pb-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-4xl text-3xl font-bold leading-snug text-[#062A4F] md:text-5xl">{t.journeyTitle}</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {t.journeySteps.map((step, index) => (
              <div key={step.title} className="rounded-[2rem] border border-[#DCEAF7] bg-white p-7 shadow-[0_18px_50px_rgba(6,42,79,0.08)] transition hover:shadow-md">
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#062A4F] text-lg font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-[#062A4F]">{step.title}</h3>
                <p className="mt-4 leading-7 text-[#50677F]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-28">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-[#DCEAF7] bg-white p-10 shadow-[0_18px_50px_rgba(6,42,79,0.08)] md:p-14">
          <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-[#0EA5A4]">{t.problemTag.toUpperCase()}</p>
          <h2 className="max-w-4xl text-3xl font-bold leading-snug text-[#062A4F] md:text-5xl">{t.problemTitle}</h2>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-[#50677F]">{t.problemText}</p>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {t.problemItems.map((item) => (
              <div key={item} className="rounded-3xl bg-[#F5FAFF] p-5 font-semibold text-[#062A4F]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="passport" className="relative z-10 px-6 pb-28">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-[#0EA5A4]">{t.passportTag}</p>
          <h2 className="text-4xl font-bold text-[#062A4F] md:text-6xl">{t.passportTitle}</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#50677F]">{t.passportText}</p>
          <div className="mt-14 space-y-5">
            {t.passportItems.map((item) => (
              <div key={item.title} className="flex flex-col gap-4 rounded-[2rem] border border-[#DCEAF7] bg-white p-6 shadow-[0_18px_50px_rgba(6,42,79,0.08)] transition hover:shadow-md md:flex-row md:items-center">
                <div className="rounded-2xl bg-[#062A4F] px-5 py-3 text-sm font-bold text-white">{item.year}</div>
                <div>
                  <h3 className="text-xl font-semibold text-[#062A4F]">{item.title}</h3>
                  <p className="mt-2 leading-7 text-[#50677F]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="clinics" className="relative z-10 px-6 pb-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-[#0EA5A4]">{t.clinicTag.toUpperCase()}</p>
            <h2 className="text-4xl font-bold leading-tight text-[#062A4F] md:text-5xl">{t.clinicTitle}</h2>
            <p className="mt-6 text-lg leading-8 text-[#50677F]">{t.clinicText}</p>
            <button onClick={() => scrollTo("waitlist")} className="mt-8 rounded-full bg-[#0B63F6] px-8 py-4 font-semibold text-white transition hover:bg-[#084FC7]">
              {t.primaryCta}
            </button>
          </div>
          <div className="grid gap-5">
            {t.clinicCards.map((card) => (
              <div key={card.title} className="rounded-[2rem] border border-[#DCEAF7] bg-white p-7 shadow-[0_18px_50px_rgba(6,42,79,0.08)]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#38BDF8]/15 text-[#0EA5A4]">
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-semibold text-[#062A4F]">{card.title}</h3>
                <p className="mt-3 leading-7 text-[#50677F]">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="assistant" className="relative z-10 px-6 pb-28">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-[#DCEAF7] bg-white p-8 shadow-[0_28px_80px_rgba(6,42,79,0.14)] md:p-10">
          <div className="mb-8 text-center">
            <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-[#0EA5A4]">{t.assistantTag}</p>
            <h2 className="text-3xl font-bold text-[#062A4F] md:text-5xl">{t.assistantTitle}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#50677F]">{t.assistantText}</p>
          </div>

          <div className="rounded-[2rem] border border-[#DCEAF7] bg-[#F5FAFF] p-5">
            <div className="mb-5 flex items-center justify-between border-b border-[#DCEAF7] pb-4">
              <div>
                <p className="text-sm font-semibold text-[#062A4F]">{t.chatDemoLabel}</p>
                <p className="text-xs text-[#7A8FA5]">{t.chatAssistantName}</p>
                <p className="mt-1 text-xs font-semibold text-[#0EA5A4]">{t.freeQuestionsLabel}: {freeQuestionsLeft}</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-[#38BDF8]" />
            </div>

            <div className="h-[320px] space-y-4 overflow-y-auto pr-2">
              <div className="max-w-[90%] rounded-3xl rounded-tl-sm bg-[#F5ECDD] px-5 py-4 text-sm leading-6 text-[#062A4F]">
                {t.chatGreeting}
              </div>

              {chatMessages.map((msg, index) => (
                <div
                  key={`${msg.role}-${index}`}
                  className={
                    msg.role === "user"
                      ? "ml-auto max-w-[85%] rounded-3xl rounded-tr-sm bg-[#062A4F] px-5 py-4 text-sm leading-6 text-white"
                      : "max-w-[90%] rounded-3xl rounded-tl-sm bg-[#F5ECDD] px-5 py-4 text-sm leading-6 text-[#062A4F]"
                  }
                >
                  {msg.text === "..." ? (
                    <span className="inline-flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#0EA5A4] [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#0EA5A4] [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#0EA5A4]" />
                    </span>
                  ) : msg.role === "assistant" ? (
                    <div className="markdown-chat space-y-2"><ReactMarkdown>{msg.text}</ReactMarkdown></div>
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
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={t.chatPlaceholder}
                className="h-14 flex-1 rounded-full border border-[#DCEAF7] bg-white px-6 text-[#062A4F] outline-none placeholder:text-[#7A8FA5]"
              />
              <button type="button" onClick={sendMessage} className="h-14 rounded-full bg-[#0B63F6] px-8 font-semibold text-white transition hover:bg-[#084FC7]">
                {t.sendButton}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="trust" className="relative z-10 px-6 pb-28">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-[#DCEAF7] bg-white p-10 shadow-[0_18px_50px_rgba(6,42,79,0.08)] md:p-14">
          <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-[#0EA5A4]">{t.trustTag.toUpperCase()}</p>
          <h2 className="max-w-4xl text-4xl font-bold text-[#062A4F] md:text-6xl">{t.trustTitle}</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {t.trustItems.map((item, index) => {
              const icons = [ShieldCheck, LockKeyhole, Stethoscope, HeartPulse];
              const Icon = icons[index] || ShieldCheck;
              return (
                <div key={item.title} className="rounded-[2rem] border border-[#DCEAF7] bg-[#F5FAFF] p-7">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF5FF] text-[#0B63F6]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#062A4F]">{item.title}</h3>
                  <p className="mt-4 leading-7 text-[#50677F]">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="waitlist" className="relative z-10 px-6 pb-32">
        <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-[#062A4F] p-10 text-center md:p-14">
          <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-[#38BDF8]">{t.accessTag.toUpperCase()}</p>
          <h2 className="text-4xl font-bold text-white md:text-6xl">{t.accessTitle}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">{t.accessText}</p>

          <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.name}
              className="h-16 rounded-full border border-white/20 bg-white/10 px-8 text-lg text-white outline-none placeholder:text-white/50 focus:border-[#38BDF8]"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.email}
              className="h-16 rounded-full border border-white/20 bg-white/10 px-8 text-lg text-white outline-none placeholder:text-white/50 focus:border-[#38BDF8]"
            />
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <RoleButton value="patient" label={t.rolePatient} dark />
              <RoleButton value="doctor" label={t.roleDoctor} dark />
              <RoleButton value="clinic" label={t.roleClinic} dark />
            </div>
            <button onClick={saveEmail} className="h-14 rounded-full bg-[#38BDF8] px-8 font-semibold text-white transition hover:bg-[#0891B2]">
              {t.join}
            </button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#DCEAF7] px-8 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-[#7A8FA5] md:flex-row md:items-center md:justify-between">
          <p>© 2026 Adamiani.ai. {t.footerRights}</p>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>

      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#062A4F]/40 backdrop-blur-sm" onClick={() => setShowRegisterModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl md:p-10">
            <button type="button" onClick={() => setShowRegisterModal(false)} className="absolute right-5 top-5 text-[#7A8FA5] transition hover:text-[#062A4F]">
              <X className="h-5 w-5" />
            </button>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#38BDF8]/40 bg-[#38BDF8]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#0EA5A4]">
              {t.modalBadge}
            </div>
            <h3 className="mt-3 text-2xl font-bold text-[#062A4F]">{t.modalTitle}</h3>
            <p className="mt-3 text-sm leading-6 text-[#50677F]">{t.modalText}</p>
            <div className="mt-6 flex flex-col gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.name}
                className="rounded-full border border-[#DCEAF7] bg-[#F5FAFF] px-6 py-3.5 text-[#062A4F] outline-none placeholder:text-[#7A8FA5] focus:border-[#38BDF8]"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.email}
                className="rounded-full border border-[#DCEAF7] bg-[#F5FAFF] px-6 py-3.5 text-[#062A4F] outline-none placeholder:text-[#7A8FA5] focus:border-[#38BDF8]"
              />
              <div className="flex flex-wrap justify-center gap-2">
                <RoleButton value="patient" label={t.rolePatient} />
                <RoleButton value="doctor" label={t.roleDoctor} />
                <RoleButton value="clinic" label={t.roleClinic} />
              </div>
              <button type="button" onClick={saveEmail} className="mt-2 rounded-full bg-[#38BDF8] px-8 py-3.5 font-semibold text-white transition hover:bg-[#0891B2]">
                {t.modalButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
