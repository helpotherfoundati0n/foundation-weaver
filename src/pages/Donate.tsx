
import React from "react";
import Navbar from "../components/Navbar";
import { CreditCard, Wallet, QrCode, ArrowRight } from "lucide-react";
import { TypewriterEffectSmooth } from "../components/TypewriterEffect";

const Donate = () => {
  return (
    <div className="min-h-screen bg-primary text-surface">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center">
              <TypewriterEffectSmooth
                  words={[
                    {text:"Make"},{text:"a"},{text:"Difference", className:"text-accent"}
                  ]}
              />
            </div>
            <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
              Your contribution can help us continue our mission of supporting those
              in need through various initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Options */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Ways to <span className="text-accent">Donate</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Direct Transfer */}
            <div className="bg-primary p-6 rounded-lg animate-scale-in">
              <CreditCard className="text-accent mb-6" size={32} />
              <h3 className="text-xl font-semibold mb-4">Direct Transfer</h3>
              <div className="space-y-4 text-surface/80">
                <p className="font-medium">Bank Details:</p>
                <p>Account Name: Help Other Foundation</p>
                <p>Account Number: XXXXXXXXXXXXX</p>
                <p>IFSC Code: XXXXXXXXX</p>
                <p>Branch: Mumbai Main</p>
              </div>
            </div>

            {/* UPI Payment */}
            <div className="bg-primary p-6 rounded-lg animate-scale-in delay-100">
              <Wallet className="text-accent mb-6" size={32} />
              <h3 className="text-xl font-semibold mb-4">UPI Payment</h3>
              <div className="space-y-4 text-surface/80">
                <p>Scan QR code or use UPI ID:</p>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <QrCode size={150} className="text-primary" />
                </div>
                <p>UPI ID: donate@helpother</p>
              </div>
            </div>

            Regular Giving
            <div className="bg-primary p-6 rounded-lg animate-scale-in delay-200">
              <ArrowRight className="text-accent mb-6" size={32} />
              <h3 className="text-xl font-semibold mb-4">Regular Giving</h3>
              <p className="text-surface/80 mb-6">
                Set up a recurring donation to help us plan and sustain our
                long-term projects.
              </p>
              <button className="bg-accent text-primary px-6 py-2 rounded-full font-medium hover:bg-accent/90 transition-colors">
                Set Up Monthly Donation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
