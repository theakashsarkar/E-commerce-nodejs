import React from "react";
import { Truck, ShieldCheck, Headphones } from "lucide-react";
const Features = () => {
  return (
    <section className="py-12 bg-muted/50">
      <div className="max-w-7xl max-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 justify-start md:justify-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-tight">
                Free Shipping
              </h3>
              <p className="text-xs md:text-sm text-gray-400 mt-0.5">
                On orders over $50
              </p>
            </div>
          </div>

          {/* 2. Secure Payment */}
          <div className="flex items-center gap-4 justify-start md:justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-tight">
                Secure Payment
              </h3>
              <p className="text-xs md:text-sm text-gray-400 mt-0.5">
                100% secure transactions
              </p>
            </div>
          </div>

          {/* 3. 24/7 Support */}
          <div className="flex items-center gap-4 justify-start md:justify-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-tight">
                24/7 Support
              </h3>
              <p className="text-xs md:text-sm text-gray-400 mt-0.5">
                Always here to help
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Features;
