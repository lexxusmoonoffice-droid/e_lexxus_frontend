"use client";
import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { apiGet } from "@/lib/api";
import { useSubmitInquiry } from "@/lib/hooks";
import toast from "react-hot-toast";

interface ContactSettings {
  email: string;
  phone: string;
  address: string;
  hours: string;
  locationLabel: string;
  locationImage: string;
  responseTimes: {
    general: string;
    technical: string;
    billing: string;
    partnerships: string;
  };
}

const topics = ["General Inquiry", "Technical Support", "Billing & Refunds", "Partnership", "Press & Media", "Other"];

export default function FeedbackPage() {
  const [sent, setSent] = useState(false);
  const [contact, setContact] = useState<ContactSettings | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("General Inquiry");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const submitM = useSubmitInquiry();

  useEffect(() => {
    apiGet<{ contact?: ContactSettings }>("/settings/public")
      .then((res) => {
        if (res.contact) setContact(res.contact);
      })
      .catch(() => {});
  }, []);

  const contactEmail = contact?.email || "hello@lexxus.com";
  const phone = contact?.phone || "+1 (800) 123-4567";
  const address = contact?.address || "340 Pine Street, New York, NY 10001";
  const hours = contact?.hours || "Mon–Fri, 9am–6pm EST";
  const locationLabel = contact?.locationLabel || "New York, NY";
  const locationImage = contact?.locationImage || "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80";

  const rtGeneral = contact?.responseTimes?.general || "24–48 hrs";
  const rtTechnical = contact?.responseTimes?.technical || "24 hrs";
  const rtBilling = contact?.responseTimes?.billing || "4–8 hrs";
  const rtPartnerships = contact?.responseTimes?.partnerships || "2–3 days";

  const contactInfo = [
    { icon: Mail, label: "Email", value: contactEmail },
    { icon: Phone, label: "Phone", value: phone },
    { icon: MapPin, label: "Address", value: address },
    { icon: Clock, label: "Hours", value: hours },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitM.mutateAsync({
        firstName,
        lastName,
        email,
        topic,
        subject,
        message,
      });
      toast.success("Thank you! Message sent successfully.");
      setSent(true);
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleReset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setTopic("General Inquiry");
    setSubject("");
    setMessage("");
    setSent(false);
  };

  return (
    <div className="bg-white">

      {/* Hero with image */}
      <section className="relative h-[60vh] min-h-[440px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1800&q=90"
          alt="Contact us"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 pb-16 w-full">
          <span className="text-xs tracking-[0.4em] uppercase text-neutral-300">Get in Touch</span>
          <h1 className="text-6xl md:text-7xl font-bold text-white mt-4 leading-none tracking-tight">
            We'd Love<br />to Hear from You
          </h1>
          <p className="text-neutral-300 mt-5 max-w-lg leading-relaxed">
            Whether it's a question, a partnership inquiry, or just a hello — our team is here.
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-24 grid md:grid-cols-[1fr_420px] gap-20">

        {/* Form */}
        <div>
          <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Send a Message</span>
          <h2 className="text-4xl font-bold mt-4 mb-10">Contact Us</h2>

          {sent ? (
            <div className="border border-neutral-200 p-12 text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Message Sent</h3>
              <p className="text-neutral-500 mt-3 leading-relaxed">Thank you for reaching out. We'll get back to you within 24 hours.</p>
              <button onClick={handleReset} className="mt-8 border border-neutral-300 px-8 py-3 text-sm tracking-widest uppercase hover:border-black transition">
                Send Another
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2">First Name</label>
                  <input
                    required
                    className="w-full border border-neutral-200 px-4 py-3.5 text-sm outline-none focus:border-black transition"
                    placeholder="Aleksander"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2">Last Name</label>
                  <input
                    required
                    className="w-full border border-neutral-200 px-4 py-3.5 text-sm outline-none focus:border-black transition"
                    placeholder="Voss"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full border border-neutral-200 px-4 py-3.5 text-sm outline-none focus:border-black transition"
                  placeholder="hello@studio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2">Topic</label>
                <select 
                  className="w-full border border-neutral-200 px-4 py-3.5 text-sm outline-none focus:border-black transition bg-white appearance-none"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2">Subject</label>
                <input
                  required
                  className="w-full border border-neutral-200 px-4 py-3.5 text-sm outline-none focus:border-black transition"
                  placeholder="How can we help?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2">Message</label>
                <textarea
                  required
                  rows={6}
                  className="w-full border border-neutral-200 px-4 py-3.5 text-sm outline-none focus:border-black transition resize-none"
                  placeholder="Tell us more..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={submitM.isPending}
                className="w-full bg-black text-white py-4 text-sm tracking-widest uppercase hover:bg-neutral-800 transition disabled:opacity-50"
              >
                {submitM.isPending ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

        {/* Contact info sidebar */}
        <div className="space-y-8">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Contact Information</span>
            <h2 className="text-4xl font-bold mt-4 mb-10">Reach Us Directly</h2>
            <div className="space-y-6">
              {contactInfo.map((c) => (
                <div key={c.label} className="flex items-start gap-4 border-b border-neutral-100 pb-6">
                  <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center shrink-0">
                    <c.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs tracking-widest uppercase text-neutral-400">{c.label}</div>
                    <div className="text-sm font-medium mt-1">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="relative overflow-hidden h-64 bg-neutral-100">
            <img
              src={locationImage}
              alt={locationLabel}
              className="w-full h-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="bg-white px-6 py-3 text-xs tracking-widest uppercase font-semibold text-center">
                {locationLabel}
              </div>
            </div>
          </div>

          {/* Response time */}
          <div className="bg-neutral-950 text-white p-8">
            <h4 className="font-semibold tracking-wide">Response Times</h4>
            <div className="mt-5 space-y-3 text-sm text-neutral-400">
              <div className="flex justify-between"><span>General inquiries</span><span className="text-white">{rtGeneral}</span></div>
              <div className="flex justify-between"><span>Technical support</span><span className="text-white">{rtTechnical}</span></div>
              <div className="flex justify-between"><span>Billing issues</span><span className="text-white">{rtBilling}</span></div>
              <div className="flex justify-between"><span>Partnerships</span><span className="text-white">{rtPartnerships}</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
