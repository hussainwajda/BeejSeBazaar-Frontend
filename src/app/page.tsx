// "use client"

// import { motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   Sprout,
//   CloudRain,
//   Bug,
//   TrendingUp,
//   Users,
//   Shield,
//   Smartphone,
//   BarChart3,
//   Leaf,
//   Droplets,
//   Target,
//   Menu,
//   X,
// } from "lucide-react"
// import { useState } from "react"
// import Link from "next/link"
// // import image1 from "@/public/indian-farmers-using-mobile-technology-in-agricult.jpg"
// // import image2 from "@/public/smartphone-app-interface-showing-crop-advisory-das.jpg"
// // import image3 from "@/public/lush-green-agricultural-fields-with-modern-farming.jpg"

// const fadeInUp = {
//   initial: { opacity: 0, y: 60 },
//   animate: { opacity: 1, y: 0 },
//   transition: { duration: 0.6 },
// }

// const staggerContainer = {
//   animate: {
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// }

// const scaleIn = {
//   initial: { opacity: 0, scale: 0.8 },
//   animate: { opacity: 1, scale: 1 },
//   transition: { duration: 0.5 },
// }

// export default function BeejSeBazaarLanding() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

//   return (
//     <div className="min-h-screen bg-background text-primary">
//       {/* Header */}
//       <motion.header
//         className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <Sprout className="h-8 w-8 text-primary" />
//             <span className="text-2xl font-bold text-foreground">BeejSeBazaar</span>
//           </div>
//           <nav className="hidden md:flex space-x-6">
//             <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
//               About
//             </a>
//             <a href="#problems" className="text-muted-foreground hover:text-primary transition-colors">
//               Problems
//             </a>
//             <a href="#solutions" className="text-muted-foreground hover:text-primary transition-colors">
//               Solutions
//             </a>
//             <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
//               Features
//             </a>
//           </nav>
//           <div className="flex items-center space-x-4">
//             <Link href="/auth/signup">
//               <Button className="hidden sm:block bg-primary hover:bg-primary/90 cursor-pointer">Get Started</Button>
//             </Link>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="md:hidden"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             >
//               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Navigation Sidebar */}
//         {isMobileMenuOpen && (
//           <motion.div
//             className="fixed inset-0 z-50 md:hidden"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             {/* Backdrop */}
//             <div
//               className="absolute inset-0 bg-background/80 backdrop-blur-sm"
//               onClick={() => setIsMobileMenuOpen(false)}
//             />

//             {/* Sidebar */}
//             <motion.div
//               className="absolute inset-y-0 right-0 w-full bg-card border-l border-border shadow-lg"
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               transition={{ type: "spring", damping: 25, stiffness: 200 }}
//             >
//               <div className="flex flex-col h-full">
//                 {/* Header */}
//                 <div className="flex items-center justify-between p-4 border-b border-border">
//                   <div className="flex items-center space-x-2">
//                     <Sprout className="h-6 w-6 text-primary" />
//                     <span className="text-lg font-bold">BeejSeBazaar</span>
//                   </div>
//                   <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
//                     <X className="h-6 w-6" />
//                   </Button>
//                 </div>

//                 {/* Navigation Links */}
//                 <nav className="flex-1 flex flex-col items-center justify-center space-y-8 p-8">
//                   <a
//                     href="#about"
//                     className="text-2xl text-muted-foreground hover:text-primary transition-colors"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     About
//                   </a>
//                   <a
//                     href="#problems"
//                     className="text-2xl text-muted-foreground hover:text-primary transition-colors"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Problems
//                   </a>
//                   <a
//                     href="#solutions"
//                     className="text-2xl text-muted-foreground hover:text-primary transition-colors"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Solutions
//                   </a>
//                   <a
//                     href="#features"
//                     className="text-2xl text-muted-foreground hover:text-primary transition-colors"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Features
//                   </a>
//                   <Button
//                     size="lg"
//                     className="bg-primary hover:bg-primary/90 mt-8"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Get Started
//                   </Button>
//                 </nav>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </motion.header>

//       {/* Hero Section */}
//       <section className="relative py-12 sm:py-20 overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
//         <img
//           src="/lush-green-agricultural-fields-with-modern-farming.jpg"
//           alt="Modern farming with technology"
//           className="absolute inset-0 w-full h-full object-cover opacity-10"
//         />
//         <div className="container mx-auto px-4 relative z-10">
//           <motion.div
//             className="text-center max-w-4xl mx-auto"
//             variants={staggerContainer}
//             initial="initial"
//             animate="animate"
//           >
//             <motion.div variants={fadeInUp} className="mb-6">
//               <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">
//                 Empowering Farmers with <span className="text-primary">Smart Crop Insights</span>
//               </h1>
//             </motion.div>
//             <motion.p
//               variants={fadeInUp}
//               className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty"
//             >
//               AI-powered multilingual advisory system helping small and marginal farmers make informed decisions about
//               crop selection, fertilizer usage, and pest control.
//             </motion.p>
//             <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
//                 Start Your Journey
//               </Button>
//               <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
//                 Watch Demo
//               </Button>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       {/* About Section */}
//       <section id="about" className="py-20 bg-muted/30">
//         <div className="container mx-auto px-4">
//           <motion.div
//             className="text-center mb-16"
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className="text-4xl font-bold text-foreground mb-4">About BeejSeBazaar</h2>
//             <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
//               Bridging the gap between traditional farming knowledge and modern agricultural science through accessible
//               technology.
//             </p>
//           </motion.div>

//           <div className="grid md:grid-cols-2 gap-12 items-center">
//             <motion.div
//               initial={{ opacity: 0, x: -40 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6 }}
//             >
//               <img
//                 src="/indian-farmers-using-mobile-technology-in-agricult.jpg"
//                 alt="Farmers using technology"
//                 className="rounded-lg shadow-lg"
//               />
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0, x: 40 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6 }}
//               className="space-y-6"
//             >
//               <div className="flex items-start space-x-4">
//                 <Target className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
//                 <div>
//                   <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
//                   <p className="text-muted-foreground">
//                     To democratize access to scientific agricultural knowledge and empower every farmer with
//                     personalized, data-driven insights.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-4">
//                 <Users className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
//                 <div>
//                   <h3 className="text-xl font-semibold mb-2">Who We Serve</h3>
//                   <p className="text-muted-foreground">
//                     Small and marginal farmers across India, agricultural extension officers, and rural communities
//                     seeking sustainable farming practices.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-4">
//                 <Leaf className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
//                 <div>
//                   <h3 className="text-xl font-semibold mb-2">Our Impact</h3>
//                   <p className="text-muted-foreground">
//                     Improving crop yields, reducing input costs, and promoting sustainable farming practices for a
//                     better tomorrow.
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Problems Section */}
//       <section id="problems" className="py-20">
//         <div className="container mx-auto px-4">
//           <motion.div
//             className="text-center mb-16"
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className="text-4xl font-bold text-foreground mb-4">Challenges Farmers Face</h2>
//             <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
//               Understanding the real problems that prevent farmers from achieving their full potential.
//             </p>
//           </motion.div>

//           <motion.div
//             className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
//             variants={staggerContainer}
//             initial="initial"
//             whileInView="animate"
//             viewport={{ once: true }}
//           >
//             {[
//               {
//                 icon: TrendingUp,
//                 title: "Poor Crop Yield",
//                 description:
//                   "Lack of scientific guidance leads to suboptimal farming decisions and reduced productivity.",
//               },
//               {
//                 icon: BarChart3,
//                 title: "High Input Costs",
//                 description: "Overuse or misuse of fertilizers and pesticides increases expenses unnecessarily.",
//               },
//               {
//                 icon: Leaf,
//                 title: "Environmental Impact",
//                 description: "Chemical overuse causes soil degradation and environmental harm.",
//               },
//               {
//                 icon: Users,
//                 title: "Unreliable Advice",
//                 description: "Dependence on third-party advice without scientific backing leads to poor outcomes.",
//               },
//             ].map((problem, index) => (
//               <motion.div key={index} variants={scaleIn}>
//                 <Card className="h-full border-border hover:shadow-lg transition-shadow">
//                   <CardHeader className="text-center">
//                     <problem.icon className="h-12 w-12 text-primary mx-auto mb-4" />
//                     <CardTitle className="text-lg">{problem.title}</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <CardDescription className="text-center">{problem.description}</CardDescription>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* Solutions Section */}
//       <section id="solutions" className="py-20 bg-muted/30">
//         <div className="container mx-auto px-4">
//           <motion.div
//             className="text-center mb-16"
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className="text-4xl font-bold text-foreground mb-4">Our Smart Solutions</h2>
//             <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
//               Comprehensive AI-powered tools designed to address every aspect of modern farming challenges.
//             </p>
//           </motion.div>

//           <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
//             <motion.div
//               initial={{ opacity: 0, x: -40 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6 }}
//               className="space-y-8"
//             >
//               <div className="flex items-start space-x-4">
//                 <div className="bg-primary/10 p-3 rounded-lg">
//                   <Smartphone className="h-6 w-6 text-primary" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold mb-2">Multilingual Mobile App</h3>
//                   <p className="text-muted-foreground">
//                     User-friendly interface supporting local languages with voice-based support for farmers with low
//                     literacy.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-4">
//                 <div className="bg-primary/10 p-3 rounded-lg">
//                   <BarChart3 className="h-6 w-6 text-primary" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
//                   <p className="text-muted-foreground">
//                     Data-driven insights combining soil health, weather patterns, and crop history for personalized
//                     recommendations.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-4">
//                 <div className="bg-primary/10 p-3 rounded-lg">
//                   <Shield className="h-6 w-6 text-primary" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold mb-2">Scientific Backing</h3>
//                   <p className="text-muted-foreground">
//                     All recommendations based on proven agricultural science and local environmental conditions.
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0, x: 40 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6 }}
//             >
//               <img
//                 src="/smartphone-app-interface-showing-crop-advisory-das.jpg"
//                 alt="BeejSeBazaar app interface"
//                 className="rounded-lg shadow-lg"
//               />
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-20">
//         <div className="container mx-auto px-4">
//           <motion.div
//             className="text-center mb-16"
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className="text-4xl font-bold text-foreground mb-4">Key Features</h2>
//             <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
//               Comprehensive tools designed to support every aspect of your farming journey.
//             </p>
//           </motion.div>

//           <motion.div
//             className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
//             variants={staggerContainer}
//             initial="initial"
//             whileInView="animate"
//             viewport={{ once: true }}
//           >
//             {[
//               {
//                 icon: Droplets,
//                 title: "Soil Health Analysis",
//                 description:
//                   "Get detailed soil composition analysis and personalized fertilizer recommendations based on your field conditions.",
//               },
//               {
//                 icon: CloudRain,
//                 title: "Weather Forecasting",
//                 description:
//                   "Receive accurate weather predictions and alerts to plan your farming activities and protect your crops.",
//               },
//               {
//                 icon: Bug,
//                 title: "Pest Detection",
//                 description:
//                   "Upload crop images for AI-powered pest and disease identification with treatment recommendations.",
//               },
//               {
//                 icon: TrendingUp,
//                 title: "Market Price Tracking",
//                 description:
//                   "Stay updated with real-time market prices to make informed decisions about when to sell your produce.",
//               },
//               {
//                 icon: Smartphone,
//                 title: "Voice Support",
//                 description:
//                   "Access all features through voice commands in your local language, perfect for farmers with limited literacy.",
//               },
//               {
//                 icon: BarChart3,
//                 title: "Progress Analytics",
//                 description:
//                   "Track your farming progress with detailed analytics and insights to continuously improve your yields.",
//               },
//             ].map((feature, index) => (
//               <motion.div key={index} variants={scaleIn}>
//                 <Card className="h-full border-border hover:shadow-lg transition-shadow group">
//                   <CardHeader className="text-center">
//                     <div className="bg-primary/10 group-hover:bg-primary/20 transition-colors p-4 rounded-lg w-fit mx-auto mb-4">
//                       <feature.icon className="h-8 w-8 text-primary" />
//                     </div>
//                     <CardTitle className="text-xl">{feature.title}</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <CardDescription className="text-center">{feature.description}</CardDescription>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* Expected Outcomes Section */}
//       <section className="py-20 bg-muted/30">
//         <div className="container mx-auto px-4">
//           <motion.div
//             className="text-center mb-16"
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className="text-4xl font-bold text-foreground mb-4">Expected Impact</h2>
//             <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
//               The positive changes we aim to bring to farming communities across India.
//             </p>
//           </motion.div>

//           <motion.div
//             className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
//             variants={staggerContainer}
//             initial="initial"
//             whileInView="animate"
//             viewport={{ once: true }}
//           >
//             {[
//               {
//                 icon: TrendingUp,
//                 title: "Improved Livelihoods",
//                 description: "Empowering farmers with informed decisions to increase productivity and income.",
//               },
//               {
//                 icon: BarChart3,
//                 title: "Cost Efficiency",
//                 description: "Optimized input usage reduces unnecessary expenses and maximizes profit margins.",
//               },
//               {
//                 icon: Leaf,
//                 title: "Sustainability",
//                 description: "Promoting responsible farming practices that protect soil and environment.",
//               },
//               {
//                 icon: Shield,
//                 title: "Food Security",
//                 description: "Better yields contribute to strengthening India's agricultural output and food security.",
//               },
//             ].map((outcome, index) => (
//               <motion.div key={index} variants={scaleIn}>
//                 <div className="text-center">
//                   <div className="bg-primary/10 p-6 rounded-full w-fit mx-auto mb-6">
//                     <outcome.icon className="h-12 w-12 text-primary" />
//                   </div>
//                   <h3 className="text-xl font-semibold mb-4">{outcome.title}</h3>
//                   <p className="text-muted-foreground">{outcome.description}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-primary text-primary-foreground">
//         <div className="container mx-auto px-4 text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Farming?</h2>
//             <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 text-pretty">
//               Join thousands of farmers who are already benefiting from smart crop advisory. Start your journey towards
//               better yields and sustainable farming today.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
//                 Download App
//               </Button>
//               <Button
//                 size="lg"
//                 variant="outline"
//                 className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
//               >
//                 Contact Us
//               </Button>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-card border-t border-border py-12">
//         <div className="container mx-auto px-4">
//           <div className="grid md:grid-cols-4 gap-8">
//             <div>
//               <div className="flex items-center space-x-2 mb-4">
//                 <Sprout className="h-8 w-8 text-primary" />
//                 <span className="text-2xl font-bold">BeejSeBazaar</span>
//               </div>
//               <p className="text-muted-foreground">
//                 Empowering farmers with smart crop insights for a sustainable future.
//               </p>
//             </div>
//             <div>
//               <h3 className="font-semibold mb-4">Product</h3>
//               <ul className="space-y-2 text-muted-foreground">
//                 <li>
//                   <a href="#" className="hover:text-primary transition-colors">
//                     Features
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-primary transition-colors">
//                     Pricing
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-primary transition-colors">
//                     API
//                   </a>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="font-semibold mb-4">Support</h3>
//               <ul className="space-y-2 text-muted-foreground">
//                 <li>
//                   <a href="#" className="hover:text-primary transition-colors">
//                     Help Center
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-primary transition-colors">
//                     Contact
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-primary transition-colors">
//                     Community
//                   </a>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="font-semibold mb-4">Company</h3>
//               <ul className="space-y-2 text-muted-foreground">
//                 <li>
//                   <a href="#" className="hover:text-primary transition-colors">
//                     About
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-primary transition-colors">
//                     Blog
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-primary transition-colors">
//                     Careers
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
//             <p>&copy; 2024 BeejSeBazaar. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface Language {
  code: string
  name: string
  nativeName: string
  speakers: string
}

const indianLanguages: Language[] = [
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", speakers: "600M+" },
  { code: "en", name: "English", nativeName: "English", speakers: "125M+" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", speakers: "100M+" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", speakers: "95M+" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", speakers: "83M+" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", speakers: "78M+" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", speakers: "56M+" },
  { code: "ur", name: "Urdu", nativeName: "اردو", speakers: "52M+" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", speakers: "44M+" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", speakers: "38M+" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", speakers: "35M+" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", speakers: "33M+" },
]

export default function LanguageSelection() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()
  // Load saved language from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage")
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage)
    }
    setIsLoaded(true)
  }, [])

  // Save language selection to localStorage
  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    try {
      localStorage.setItem("selectedLanguage", languageCode)
      localStorage.setItem("language", languageCode)
    } catch {}
  }

  const handleContinue = () => {
    if (selectedLanguage) {
      console.log("Selected language:", selectedLanguage)
      // Here you can redirect to the main app or trigger any callback
      router.push("/auth/signup");
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-4">
            <Globe className="h-8 w-8 sm:h-10 sm:w-10 text-primary mr-3" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground text-balance">
              Choose Your Language
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto text-pretty">
            Select your preferred language to continue. Your choice will be saved for future visits.
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {indianLanguages.map((language) => (
            <Card
              key={language.code}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                "border-2 bg-card",
                selectedLanguage === language.code
                  ? "border-accent bg-accent/5 shadow-md"
                  : "border-border hover:border-accent/50",
              )}
              onClick={() => handleLanguageSelect(language.code)}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-card-foreground text-sm sm:text-base truncate">
                      {language.name}
                    </h3>
                    <p className="text-lg sm:text-xl font-medium text-primary mt-1 truncate">{language.nativeName}</p>
                  </div>
                  {selectedLanguage === language.code && (
                    <div className="flex-shrink-0 ml-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-accent rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-accent-foreground" />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{language.speakers} speakers</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedLanguage}
            size="lg"
            className="w-full sm:w-auto min-w-[200px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 text-base sm:text-lg"
          >
            Continue
          </Button>
          {selectedLanguage && (
            <p className="mt-3 text-sm text-muted-foreground">
              Selected: {indianLanguages.find((lang) => lang.code === selectedLanguage)?.name}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Your language preference is saved locally and will be remembered for future visits.
          </p>
        </div>
      </div>
    </div>
  )
}

