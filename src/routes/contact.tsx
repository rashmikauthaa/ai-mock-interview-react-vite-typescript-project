import { Container } from "@/components/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject must be less than 200 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export const ContactPage = () => {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate form submission - Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Message sent successfully!", {
        description: "We'll get back to you within 24 hours.",
      });
      form.reset();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      content: "support@aimockinterview.com",
      link: "mailto:support@aimockinterview.com",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      content: "123 AI Street, Tech City, 12345",
      link: "#",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      content: "Mon - Fri: 9:00 AM - 6:00 PM EST",
      link: "#",
    },
  ];

  const socialLinks = [
    {
      icon: <Facebook className="w-5 h-5" />,
      href: "https://facebook.com",
      label: "Facebook",
      color: "hover:text-blue-500",
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      href: "https://twitter.com",
      label: "Twitter",
      color: "hover:text-blue-400",
    },
    {
      icon: <Instagram className="w-5 h-5" />,
      href: "https://instagram.com",
      label: "Instagram",
      color: "hover:text-pink-500",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://linkedin.com",
      label: "LinkedIn",
      color: "hover:text-blue-700",
    },
  ];

  return (
    <div className="w-full min-h-screen py-12">
      <Container>
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground">
            Get in <span className="text-outline">Touch</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Send us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                disabled={isSubmitting}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                disabled={isSubmitting}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="How can we help?"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us more about your inquiry..."
                              rows={6}
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message <Send className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="hover:shadow-md transition-shadow cursor-pointer border-2"
                >
                  <CardContent className="pt-6">
                    <a
                      href={info.link}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-200 transition-colors">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {info.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {info.content}
                        </p>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Social Media */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Follow Us</CardTitle>
                <CardDescription>
                  Stay connected with us on social media
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-gray-600 hover:border-emerald-400 ${social.color} transition-all`}
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ContactPage;
