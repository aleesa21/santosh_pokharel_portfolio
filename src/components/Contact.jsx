import React, { useState } from "react";
// Icons imported from react-icons
import {
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaPaperPlane,
  FaClock,
  FaShieldHalved,
} from "react-icons/fa6";
import {
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaFacebookF,
} from "react-icons/fa";
import { HiOutlineChatBubbleBottomCenterText } from "react-icons/hi2";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {   
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g. API call)
    setSubmitted(true);
  };

  const contactInfo = [
    {
      title: "Direct Office Desk",
      value: "GTV Newsroom, Singha Durbar Marg, Kathmandu",
      icon: FaLocationDot,
    },
    {
      title: "Secure News Tip / Email",
      value: "santosh.pokharel@gtvnepal.com",
      icon: FaEnvelope,
    },
    {
      title: "Phone / WhatsApp",
      value: "+977 1-4200000 / +977 9800000000",
      icon: FaPhone,
    },
    {
      title: "Office Hours",
      value: "Sun - Fri: 9:00 AM - 7:00 PM NPT",
      icon: FaClock,
    },
  ];

  const socialLinks = [
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
    { icon: FaYoutube, href: "#", label: "YouTube" },
    { icon: FaFacebookF, href: "#", label: "Facebook" },
  ];

  return (
    <section className="relative bg-slate-900/5 text-slate-900 flex flex-col w-full border-b border-slate-200 py-12 md:py-20 2xl:py-28 overflow-hidden">
      {/* Background Subtle Mesh & Grid Pattern to match Hero */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-100/40 rounded-full filter blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto w-full px-4 md:px-15 2xl:px-20">
        {/* Section Header */}
        <div className="max-w-2xl mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-red-100/80 border border-red-200/90 px-3 py-1 2xl:px-5 2xl:py-2 rounded-full text-red-700 font-bold text-[11px] 2xl:text-sm tracking-wider shadow-xs mb-4">
            <HiOutlineChatBubbleBottomCenterText className="w-4 h-4 2xl:w-6 2xl:h-6 text-red-600 animate-pulse" />
            <span>GET IN TOUCH · SECURE DROP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-7xl font-black text-slate-900 tracking-tight leading-none">
            Let's Talk & <span className="text-red-700">Investigate</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base 2xl:text-xl text-slate-600 leading-relaxed font-normal mt-3">
            Have a news tip, confidential document, or a story that needs
            exposure across Nepal? Reach out securely or drop a direct message
            below.
          </p>
        </div>

        {/* Grid Layout: Contact Details & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 2xl:gap-20 items-start">
          {/* Left Column: Contact Cards & Info */}
          <div className="lg:col-span-5 flex flex-col gap-4 2xl:gap-6">
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 2xl:gap-4">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="group relative flex items-start gap-4 p-4 2xl:p-6 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-red-200 transition-all duration-200"
                  >
                    <div className="p-2.5 2xl:p-4 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4 2xl:w-6 2xl:h-6" />
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
                );
              })}
            </div>

            {/* Confidentiality Notice */}
            <div className="flex items-start gap-3 p-4 2xl:p-6 rounded-xl bg-slate-900 text-white shadow-lg border border-slate-800">
              <FaShieldHalved className="w-5 h-5 2xl:w-7 2xl:h-7 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs sm:text-sm 2xl:text-base">
                  Confidentiality Assured
                </h5>
                <p className="text-[11px] sm:text-xs 2xl:text-sm text-slate-400 mt-1 leading-relaxed">
                  Source protection is a top priority. Sensitive leaks and
                  whistleblower materials are handled with strict journalistic
                  privilege.
                </p>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-2">
              <p className="text-xs 2xl:text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                Connect on Socials
              </p>
              <div className="flex items-center gap-2.5">
                {socialLinks.map((social, idx) => {
                  const SocialIcon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      aria-label={social.label}
                      className="p-3 bg-white hover:bg-red-700 hover:text-white text-slate-700 border border-slate-200 rounded-xl shadow-2xs hover:shadow-md transition-all duration-200"
                    >
                      <SocialIcon className="w-4 h-4 2xl:w-5 2xl:h-5" />
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
                    Message Dispatched
                  </h3>
                  <p className="text-slate-600 max-w-sm text-sm 2xl:text-base">
                    Thank you for reaching out. Santosh Pokharel or the
                    editorial desk will review your submission shortly.
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
                    className="mt-4 px-6 py-2.5 bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-slate-800 transition-colors"
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
                      Subject / Topic <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. News Tip: Investigation regarding..."
                      className="px-4 py-3 2xl:px-5 2xl:py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm 2xl:text-base focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all"
                    />
                  </div>

                  {/* Message input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs 2xl:text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Message / Tip Details{" "}
                      <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Provide all relevant background information..."
                      className="px-4 py-3 2xl:px-5 2xl:py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm 2xl:text-base focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 2xl:gap-3 w-full px-6 py-3.5 2xl:px-9 2xl:py-4 text-xs sm:text-sm 2xl:text-lg font-bold text-white bg-red-700 hover:bg-red-800 active:scale-[0.98] rounded-xl shadow-md shadow-red-900/10 transition-all cursor-pointer group mt-2"
                  >
                    <FaPaperPlane className="w-3.5 h-3.5 2xl:w-5 2xl:h-5 fill-current group-hover:translate-x-1 transition-transform" />
                    Submit Secure Tip / Message
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
