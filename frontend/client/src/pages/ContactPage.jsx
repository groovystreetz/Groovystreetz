import React, { useState } from 'react'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, Phone, Mail, Clock, MessageCircle, HelpCircle, Send, CheckCircle, Loader2, X } from "lucide-react"
import { useContact } from "@/hooks/useContact"

const ContactPage = () => {
  const { submitContactForm, loading, error } = useContact()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  // const [isSubmitted, setIsSubmitted] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogType, setDialogType] = useState('success') // 'success' or 'error'
  const [dialogMessage, setDialogMessage] = useState('')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await submitContactForm(formData)
      setDialogType('success')
      setDialogMessage('Thank you for contacting us! We have received your message and will get back to you soon.')
      setShowDialog(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (err) {
      console.error('Failed to submit contact form:', err)
      setDialogType('error')
      setDialogMessage(error || 'Failed to send your message. Please try again later.')
      setShowDialog(true)
    }
  }

  return (
    <div className="w-screen overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative w-full max-w-screen overflow-hidden mt-12 sm:mt-16 h-[50vh] sm:h-[70vh] md:h-[80vh] flex items-center justify-center font-['Plus Jakarta Sans','Noto Sans',sans-serif]">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%), url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 1,
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-3 sm:px-6 md:px-8 w-full max-w-4xl">
          <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-[-0.02em] drop-shadow-lg animate-fade-in-up">
            Get in Touch
          </h1>
          <h2 className="mt-4 text-white text-lg sm:text-xl md:text-2xl font-normal leading-normal drop-shadow-md animate-fade-in-up delay-150 max-w-3xl px-2">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </h2>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glassmorphism rounded-2xl text-center hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Visit Us</h3>
                <p className="text-gray-600">123 Fashion Street<br />New York, NY 10001</p>
              </CardContent>
            </Card>

            <Card className="glassmorphism rounded-2xl text-center hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Call Us</h3>
                <p className="text-gray-600">+1 (555) 123-4567<br />Mon-Fri 9AM-6PM</p>
              </CardContent>
            </Card>

            <Card className="glassmorphism rounded-2xl text-center hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Us</h3>
                <p className="text-gray-600">hello@groovystreetz.com<br />support@groovystreetz.com</p>
              </CardContent>
            </Card>

            <Card className="glassmorphism rounded-2xl text-center hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Business Hours</h3>
                <p className="text-gray-600">Mon-Fri: 9AM-6PM<br />Sat: 10AM-4PM</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Send us a Message</h2>
            <p className="text-gray-600 text-lg">Have a question or need help? We're here to assist you!</p>
          </div>

          <Card className="glassmorphism rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <MessageCircle className="h-6 w-6 text-orange-600" />
                Contact Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-base font-medium">Full Name *</Label>
                      <Input
                        id="name"
                        className="rounded-xl mt-2"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-base font-medium">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        className="rounded-xl mt-2"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="text-base font-medium">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        className="rounded-xl mt-2"
                        placeholder="Enter your phone number (max 15 characters)"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 15) {
                            handleInputChange('phone', value);
                          }
                        }}
                        maxLength={15}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {formData.phone.length}/15 characters
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-base font-medium">Subject *</Label>
                      <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                        <SelectTrigger className="rounded-xl mt-2">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="order">Order</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="shipping">Shipping</SelectItem>
                          <SelectItem value="return">Return</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-base font-medium">Message *</Label>
                    <Textarea
                      id="message"
                      className="rounded-xl mt-2"
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                      {error}
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl h-12 text-lg font-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 text-lg">Find answers to common questions about our products and services</p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How long does shipping take?",
                answer: "We typically process orders within 1-2 business days. Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days."
              },
              {
                question: "What is your return policy?",
                answer: "We offer a 30-day return policy for unworn items with tags attached. Returns are free and easy - just contact our support team to initiate a return."
              },
              {
                question: "Do you offer international shipping?",
                answer: "Yes! We ship to over 50 countries worldwide. International shipping typically takes 7-14 business days depending on the destination."
              },
              {
                question: "How can I track my order?",
                answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the order history page."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and various other payment methods."
              }
            ].map((faq, index) => (
              <Card key={index} className="glassmorphism rounded-xl hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <HelpCircle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-16 px-4 border-none shadow-none bg-[#F57C26]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Our customer support team is here to help you 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              className="bg-white text-orange-600 hover:bg-orange-50 rounded-xl px-8 py-3 text-lg font-semibold"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call Now
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent text-white border-white hover:bg-white hover:text-orange-600 rounded-xl px-8 py-3 text-lg font-semibold"
            >
              <Mail className="h-5 w-5 mr-2" />
              Email Support
            </Button>
          </div>
        </div>
      </section>

      {/* Success/Error Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {dialogType === 'success' ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <X className="h-6 w-6 text-red-500" />
              )}
              {dialogType === 'success' ? 'Message Sent Successfully!' : 'Error Sending Message'}
            </DialogTitle>
            <DialogDescription className="text-base">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button 
              onClick={() => setShowDialog(false)}
              className={`${
                dialogType === 'success' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              } text-white rounded-xl`}
            >
              {dialogType === 'success' ? 'Great!' : 'Try Again'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}

export default ContactPage