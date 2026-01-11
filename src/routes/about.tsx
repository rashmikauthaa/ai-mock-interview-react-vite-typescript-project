import { Container } from "@/components/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Target,
  Users,
  Lightbulb,
  Award,
  TrendingUp,
  Heart,
} from "lucide-react";

export const AboutPage = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Mission-Driven",
      description:
        "We're committed to democratizing interview preparation and making career success accessible to everyone.",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation First",
      description:
        "We leverage cutting-edge AI technology to provide personalized, actionable insights that help you excel.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "User-Centric",
      description:
        "Your success is our success. We build every feature with your needs and goals in mind.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, from our AI models to our user experience.",
    },
  ];

  const stats = [
    { label: "Active Users", value: "250K+", icon: <Users className="w-6 h-6" /> },
    { label: "Interviews Completed", value: "1.2M+", icon: <TrendingUp className="w-6 h-6" /> },
    { label: "Success Rate", value: "85%", icon: <Award className="w-6 h-6" /> },
    { label: "Satisfaction", value: "4.9/5", icon: <Heart className="w-6 h-6" /> },
  ];

  return (
    <div className="w-full min-h-screen py-12">
      <Container>
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground">
            About <span className="text-outline">Us</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Empowering professionals worldwide to ace their interviews with
            AI-powered insights and personalized practice.
          </p>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                To revolutionize interview preparation by providing accessible,
                AI-powered tools that help job seekers build confidence, improve
                their skills, and land their dream roles. We believe everyone
                deserves the opportunity to showcase their true potential.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-sky-600" />
              </div>
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                To become the world's leading platform for interview preparation,
                where millions of professionals turn to prepare, practice, and
                succeed. We envision a future where no great candidate misses
                their opportunity due to lack of preparation.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-3 text-muted-foreground">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all hover:border-emerald-400"
              >
                <CardHeader>
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-100 to-sky-100 flex items-center justify-center mb-4 text-emerald-600">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-0">
          <CardHeader>
            <CardTitle className="text-3xl mb-4">Our Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base text-muted-foreground leading-relaxed">
              Founded in 2024, our platform was born from a simple observation:
              talented professionals were struggling in interviews not because
              they lacked skills, but because they lacked proper preparation and
              confidence.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              We set out to change that by combining the power of artificial
              intelligence with deep insights into what makes interviews
              successful. Today, we're proud to have helped hundreds of thousands
              of professionals improve their interview skills and advance their
              careers.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Our team of engineers, data scientists, and career experts work
              tirelessly to ensure our platform stays at the forefront of
              interview preparation technology, continuously improving our AI
              models and expanding our feature set to serve you better.
            </p>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default AboutPage;
