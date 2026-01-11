import { Container } from "@/components/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  MessageSquare,
  BarChart3,
  Brain,
  Users,
  CheckCircle2,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "AI-Powered Mock Interviews",
    description:
      "Simulate real interviews tailored to your role, experience, and tech stack with adaptive AI questioning.",
    features: [
      "Role-specific interviews",
      "Adaptive difficulty",
      "Real-time evaluation",
    ],
    color: "emerald",
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Instant Feedback",
    description:
      "Get structured feedback on communication, correctness, and depth — just like a real interviewer.",
    features: [
      "Answer breakdown",
      "Strength & weakness analysis",
      "Actionable suggestions",
    ],
    color: "sky",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Performance Analytics",
    description:
      "Track your progress across interviews and understand where you actually need improvement.",
    features: [
      "Skill-wise scoring",
      "Progress tracking",
      "Performance trends",
    ],
    color: "purple",
  },
];

const colorMap = {
  emerald: "text-emerald-600 border-emerald-200",
  sky: "text-sky-600 border-sky-200",
  purple: "text-purple-600 border-purple-200",
  orange: "text-orange-600 border-orange-200",
  pink: "text-pink-600 border-pink-200",
};

export const ServicesPage = () => {
  return (
    <div className="w-full py-20">
      <Container>
        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Everything You Need to
            <span className="text-outline"> Crack Interviews</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            A complete AI-powered interview preparation platform designed for
            real-world hiring processes.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <Link to="/generate">
              <Button size="lg">
                Start Mock Interview <Sparkles className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Talk to Us
              </Button>
            </Link>
          </div>
        </div>

        {/* SERVICES GRID */}
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 place-items-center mb-28">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`w-full max-w-md border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${
                colorMap[service.color as keyof typeof colorMap]
              }`}
            >
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                  {service.icon}
                </div>
                <CardTitle className="text-xl">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription>
                  {service.description}
                </CardDescription>
                <ul className="space-y-2">
                  {service.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* WHO IS THIS FOR */}
        <div className="grid md:grid-cols-3 gap-8 mb-28">
          {[
            {
              icon: <Target className="w-6 h-6" />,
              title: "Students",
              text: "Prepare confidently for campus and off-campus placements.",
            },
            {
              icon: <Users className="w-6 h-6" />,
              title: "Working Professionals",
              text: "Practice role-specific interviews for job switches.",
            },
            {
              icon: <Brain className="w-6 h-6" />,
              title: "Career Switchers",
              text: "Understand expectations before entering a new domain.",
            },
          ].map((item, i) => (
            <Card key={i} className="border">
              <CardHeader className="space-y-3">
                {item.icon}
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FINAL CTA */}
        <Card className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white border-0">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-3xl">
              Ready to Practice Like a Real Interview?
            </CardTitle>
            <CardDescription className="text-white/90">
              Start your AI-powered mock interview now and improve with every
              attempt.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link to="/generate">
              <Button size="lg" variant="secondary">
                Start Interview <Sparkles className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default ServicesPage;
