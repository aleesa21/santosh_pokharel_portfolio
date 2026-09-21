import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaPaperPlane } from "react-icons/fa6";
import { FaTwitter, FaFacebookF } from "react-icons/fa";
import { HiOutlineChatBubbleBottomCenterText } from "react-icons/hi2";
import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    emailjs
      .send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        PUBLIC_KEY,
      )
      .then(() => {
        setSubmitted(true);
        setSending(false);
      })
      .catch((err) => {
        console.log("EmailJS error:", err);
        setError("Something went wrong. Please try again.");
        setSending(false);
      });
    console.log(formData);
  };

  const quickChannels = [
    {
      title: "Email",
      value: "santosh.pokharel@gtvnepal.com",
      actionText: "Write Email",
      href: "mailto:santosh.pokharel@gtvnepal.com",
      icon: FaEnvelope,
      color:
        "bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white",
    },
    {
      title: "Phone Number",
      value: "+977 1-4200000",
      actionText: "Call Now",
      href: "tel:+97714200000",
      icon: FaPhone,
      color:
        "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    },
  ];

  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "https://www.facebook.com/santosh.pokhrel.355",
      label: "Facebook",
      handle: "GTV Nepal",
    },
    {
      icon: FaTwitter,
      href: "https://www.facebook.com/santosh.pokhrel.355",
      label: "Twitter / X",
      handle: "@GTVNepal",
    },
  ];

  return (
    <section className="relative bg-white text-slate-900 flex flex-col w-full border-b border-slate-200 py-12 md:py-20 2xl:py-28 overflow-hidden">
      {/* Background Subtle Mesh & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-100/40 rounded-full filter blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto w-full px-4 md:px-15 2xl:px-20">
        {/* Section Header */}
        <div className="max-w-2xl mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-red-100/80 border border-red-200/90 px-3 py-1 2xl:px-5 2xl:py-2 rounded-full text-red-700 font-bold text-[11px] 2xl:text-sm tracking-wider shadow-xs mb-4">
            <HiOutlineChatBubbleBottomCenterText className="w-4 h-4 2xl:w-6 2xl:h-6 text-red-600 animate-pulse" />
            <span>GET IN TOUCH · WORK & COLLABORATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-7xl font-black text-slate-900 tracking-tight leading-none">
            Let's Work <span className="text-red-700">Together</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base 2xl:text-xl text-slate-600 leading-relaxed font-normal mt-3">
            Looking to collaborate on a media project, schedule an interview, or
            discuss professional opportunities? Get in touch directly using the
            form or channels below.
          </p>
        </div>

        {/* Grid Layout: Quick Action Links & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 2xl:gap-20 items-start">
          {/* Left Column: Direct Channels & Socials */}
          <div className="lg:col-span-5 flex flex-col gap-6 2xl:gap-8">
            {/* Direct Communication Action Cards */}
            <div className="flex flex-col gap-3 2xl:gap-4">
              <p className="text-xs 2xl:text-sm font-bold text-slate-400 uppercase tracking-wider">
                Direct Contact
              </p>
              {quickChannels.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-between p-4 2xl:p-5 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-red-200 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-lg transition-colors ${item.color}`}
                      >
                        <Icon className="w-4 h-4 2xl:w-5 2xl:h-5" />
                      </div>
                      <div>
                        <h4 className="text-[11px] sm:text-xs 2xl:text-sm font-bold text-slate-400 uppercase tracking-wider">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-900 mt-0.5">
                          {item.value}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-red-600 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline-block">
                      {item.actionText} &rarr;
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Social Media Grid */}
            <div>
              <p className="text-xs 2xl:text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                Professional Networks & Socials
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {socialLinks.map((social, idx) => {
                  const SocialIcon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-3.5 bg-white text-slate-700 border border-slate-200 hover:border-slate-400 rounded-xl shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                    >
                      <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 transition-colors">
                        <SocialIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold group-hover:text-slate-900">
                          {social.label}
                        </p>
                        <p className="text-[11px] text-slate-400 group-hover:text-slate-600">
                          {social.handle}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="relative p-6 sm:p-8 2xl:p-12 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xl backdrop-blur-md">
              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <FaPaperPlane className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Inquiry Sent Successfully
                  </h3>
                  <p className="text-slate-600 max-w-sm text-sm 2xl:text-base">
                    Thank you for reaching out. Santosh Pokharel will review
                    your work inquiry and get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="mt-4 px-6 py-2.5 bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 2xl:gap-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-6">
                    {/* Name input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs 2xl:text-sm font-bold text-slate-700 uppercase tracking-wider">
                        Your Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Ram Bahadur"
                        className="px-4 py-3 2xl:px-5 2xl:py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm 2xl:text-base focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all"
                      />
                    </div>

                    {/* Email input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs 2xl:text-sm font-bold text-slate-700 uppercase tracking-wider">
                        Email Address <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. ram@example.com"
                        className="px-4 py-3 2xl:px-5 2xl:py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm 2xl:text-base focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all"
                      />
                    </div>
                  </div>

                  {/* Subject input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs 2xl:text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Subject / Purpose <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Project Collaboration / Interview Request"
                      className="px-4 py-3 2xl:px-5 2xl:py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm 2xl:text-base focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all"
                    />
                  </div>

                  {/* Message input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs 2xl:text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Project Details / Message{" "}
                      <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Share details about the work, proposal, or timeline..."
                      className="px-4 py-3 2xl:px-5 2xl:py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm 2xl:text-base focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all resize-none"
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <p className="text-red-600 text-xs sm:text-sm font-semibold -mt-2">
                      {error}
                    </p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex items-center justify-center gap-2 2xl:gap-3 w-full px-6 py-3.5 2xl:px-9 2xl:py-4 text-xs sm:text-sm 2xl:text-lg font-bold text-white bg-red-700 hover:bg-red-800 active:scale-[0.98] rounded-xl shadow-md shadow-red-900/10 transition-all cursor-pointer group mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <FaPaperPlane className="w-3.5 h-3.5 2xl:w-5 2xl:h-5 fill-current group-hover:translate-x-1 transition-transform" />
                    {sending ? "Sending..." : "Send Work Inquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
