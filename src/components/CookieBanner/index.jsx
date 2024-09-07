import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { FaCookieBite } from 'react-icons/fa';

const CookieBanner = () => {
  const [visible, setVisible] = useState(true);
  const [preferences, setPreferences] = useState(false);
  const [statistics, setStatistics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const cookieConsent = JSON.parse(Cookies.get('cookieConsent') || '{}');
    if (cookieConsent.consent) {
      setVisible(false);
    }
    setPreferences(cookieConsent.preferences || false);
    setStatistics(cookieConsent.statistics || false);
    setMarketing(cookieConsent.marketing || false);
  }, []);

  const sendPreferencesToBackend = (consent) => {
    fetch('https://your-backend-api.com/api/cookie-consent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(consent),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const acceptAllCookies = () => {
    const consent = {
      consent: true,
      preferences: true,
      statistics: true,
      marketing: true,
    };
    Cookies.set('cookieConsent', JSON.stringify(consent), { expires: 365 });
    setVisible(false);
    sendPreferencesToBackend(consent);
  };

  const acceptSelectedCookies = () => {
    const consent = {
      consent: true,
      preferences: preferences,
      statistics: statistics,
      marketing: marketing,
    };
    Cookies.set('cookieConsent', JSON.stringify(consent), { expires: 365 });
    setVisible(false);
    sendPreferencesToBackend(consent);
  };

  const denyAllCookies = () => {
    const consent = {
      consent: false,
      preferences: false,
      statistics: false,
      marketing: false,
    };
    Cookies.set('cookieConsent', JSON.stringify(consent), { expires: 365 });
    setVisible(false);
    sendPreferencesToBackend(consent);
  };

  return (
    <div>
      {visible ? (
        <div className="fixed bottom-0 w-full bg-[#6A45FF] text-white p-6 shadow-lg z-[9999]">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex-1">
              <h2 className="text-lg font-semibold">This website uses cookies</h2>
              <p className="text-sm">
                We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end space-y-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="form-checkbox h-4 w-4" checked disabled />
                  <span className="ml-2 text-sm">Necessary</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="form-checkbox h-4 w-4" checked={preferences} onChange={() => setPreferences(!preferences)} />
                  <span className="ml-2 text-sm">Preferences</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="form-checkbox h-4 w-4" checked={statistics} onChange={() => setStatistics(!statistics)} />
                  <span className="ml-2 text-sm">Statistics</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="form-checkbox h-4 w-4" checked={marketing} onChange={() => setMarketing(!marketing)} />
                  <span className="ml-2 text-sm">Marketing</span>
                </label>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button className="bg-white text-[#6A45FF] px-4 py-2 rounded-md hover:bg-gray-200" onClick={denyAllCookies}>Deny</button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={acceptSelectedCookies}>Allow Selection</button>
                <button className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800" onClick={acceptAllCookies}>Accept All</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-4 left-4 bg-[#6A45FF] p-2 rounded-full cursor-pointer z-[9998] hover:bg-blue-700" onClick={() => setVisible(true)}>
          <FaCookieBite className="text-white w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default CookieBanner;


/*

Evet, kullanıcıların çerez tercihlerini anonim olarak istatistiksel amaçlarla toplamak ve analiz etmek mantıklıdır. Bu şekilde, kaç kişinin çerezleri kabul ettiğini veya reddettiğini görebilirsiniz. Aşağıda, çerez tercihlerini anonim olarak backend'e nasıl göndereceğinizi ve bu verileri nasıl işleyeceğinizi anlatan bir örnek bulunmaktadır.

Çerez Tercihlerini Anonim Olarak Backend'e Gönderme
Kullanıcı Kimliği Yerine Anonim İstatistikler Gönderme:

Kullanıcı kimliği yerine sadece tercih edilen çerez tiplerini gönderin.
Backend sunucusu bu verileri toplayıp analiz edebilir.
Backend API:

Backend API'yi bu verileri almak ve işlemek için ayarlayın.
Çerez Tercihlerini Gönderme

bakcnedi boyle;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CookieConsentController : ControllerBase
    {
        private static List<CookieConsentModel> CookieConsents = new List<CookieConsentModel>();

        [HttpPost]
        public IActionResult SetCookieConsent([FromBody] CookieConsentModel model)
        {
            CookieConsents.Add(model);
            return Ok(new { success = true, message = "Cookie consent saved successfully" });
        }

        [HttpGet]
        public IActionResult GetCookieConsentStats()
        {
            int total = CookieConsents.Count;
            int preferencesAccepted = CookieConsents.Count(c => c.Preferences);
            int statisticsAccepted = CookieConsents.Count(c => c.Statistics);
            int marketingAccepted = CookieConsents.Count(c => c.Marketing);

            var stats = new
            {
                total,
                preferencesAccepted,
                statisticsAccepted,
                marketingAccepted,
                preferencesRejected = total - preferencesAccepted,
                statisticsRejected = total - statisticsAccepted,
                marketingRejected = total - marketingAccepted
            };

            return Ok(stats);
        }
    }

    public class CookieConsentModel
    {
        public bool Consent { get; set; }
        public bool Preferences { get; set; }
        public bool Statistics { get; set; }
        public bool Marketing { get; set; }
    }
}



*/
