import React, { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { Send, Check, Loader2, Shield, Clock, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface FormData {
  name: string;
  email: string;
  company: string;
  challenge: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  challenge?: string;
}

const ContactSection: React.FC = () => {
  const { ref, isInView } = useInView();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    challenge: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.challenge.trim()) {
      newErrors.challenge = 'Please describe your challenge';
    } else if (formData.challenge.trim().length < 20) {
      newErrors.challenge = 'Please provide a bit more detail (20+ characters)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');

    try {
      const { data, error } = await supabase.functions.invoke('submit-contact', {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim(),
          challenge: formData.challenge.trim(),
        },
      });

      if (error) {
        throw new Error(error.message || 'Submission failed');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setStatus('success');
      setFormData({ name: '', email: '', company: '', challenge: '' });
      toast({
        title: 'Message sent successfully!',
        description: data?.message || "I'll get back to you within 24 hours with 3 actionable insights.",
      });
    } catch (err: unknown) {
      setStatus('error');
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      toast({
        title: 'Submission failed',
        description: message,
        variant: 'destructive',
      });
      // Allow retry after error
      setTimeout(() => {
        if (status === 'error') setStatus('idle');
      }, 3000);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const inputClasses = (field: keyof FormData) =>
    `w-full px-5 py-3.5 rounded-xl bg-white dark:bg-white/5 border transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none ${
      errors[field]
        ? 'border-red-300 dark:border-red-500/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
        : focusedField === field
        ? 'border-blue-400 dark:border-blue-500/50 ring-2 ring-blue-500/20 scale-[1.01]'
        : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
    }`;

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-slate-50 dark:bg-[#0d1f33] overflow-hidden">
      {/* Particle background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div ref={ref} className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left - Info */}
          <div
            className={`transition-all duration-700 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 mb-6">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Let's Talk</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
              Ready to stop fighting
              <br />
              <span className="gradient-text">technical fires?</span>
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
              Book a free 30-minute technical audit call. I'll review your current situation and give you{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">3 actionable insights</span>—no strings attached.
            </p>

            {/* Trust builders */}
            <div className="space-y-4">
              {[
                { icon: Shield, text: 'No pitch. Just honest advice from someone who\'s been there.' },
                { icon: Clock, text: '30 minutes. 3 insights. Zero obligation.' },
                { icon: MessageSquare, text: 'Direct access to a senior technical leader.' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-3 transition-all duration-500 ${
                      isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                    }`}
                    style={{ transitionDelay: `${300 + i * 100}ms` }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mt-0.5">
                      <Icon className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{item.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Email fallback */}
            <div className="mt-10 p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Prefer email? Reach me directly at{' '}
                <a
                  href="mailto:jamescampbell0195@gmail.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium break-all sm:break-normal"
                >
                  jamescampbell0195@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Right - Form */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            {status === 'success' ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-8 rounded-2xl bg-white dark:bg-white/5 border border-green-200 dark:border-green-500/20 animate-scale-in">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    I'll get back to you within 24 hours with your 3 actionable insights.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl">
                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="John Smith"
                      className={inputClasses('name')}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500 animate-fade-in">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="john@company.com"
                      className={inputClasses('email')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500 animate-fade-in">{errors.email}</p>
                    )}
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      onFocus={() => setFocusedField('company')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Acme Inc."
                      className={inputClasses('company')}
                    />
                    {errors.company && (
                      <p className="mt-1 text-xs text-red-500 animate-fade-in">{errors.company}</p>
                    )}
                  </div>

                  {/* Challenge */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Technical Challenge
                    </label>
                    <textarea
                      value={formData.challenge}
                      onChange={(e) => handleChange('challenge', e.target.value)}
                      onFocus={() => setFocusedField('challenge')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Tell me about the technical challenges you're facing..."
                      rows={4}
                      className={inputClasses('challenge') + ' resize-none'}
                    />
                    {errors.challenge && (
                      <p className="mt-1 text-xs text-red-500 animate-fade-in">{errors.challenge}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full group flex items-center justify-center gap-2 px-7 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : status === 'error' ? (
                      <>
                        Try Again
                        <Send className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Book My Free Audit Call
                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
