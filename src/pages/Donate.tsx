
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
          <div className="grid md:grid-cols-4 gap-8">
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

            {/* Sadka & Zakat */}
            <div className="bg-primary p-6 rounded-lg animate-scale-in delay-100">
              <QrCode className="text-accent mb-6" size={32} />
              <h3 className="text-xl font-semibold mb-4">Sadka & Zakat</h3>
              <div className="space-y-4 text-surface/80">
                <p>Scan QR code for Sadka & Zakat donations:</p>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <QrCode size={150} className="text-primary" />
                </div>
                <p>UPI ID: sadkazakat@helpother</p>
              </div>
            </div>

            {/* Lillah */}
            <div className="bg-primary p-6 rounded-lg animate-scale-in delay-200">
              <QrCode className="text-accent mb-6" size={32} />
              <h3 className="text-xl font-semibold mb-4">Lillah</h3>
              <div className="space-y-4 text-surface/80">
                <p>Scan QR code for Lillah donations:</p>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <QrCode size={150} className="text-primary" />
                </div>
                <p>UPI ID: lillah@helpother</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
