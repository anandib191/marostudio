import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);
const resolve4 = promisify(dns.resolve4);

// Import disposable email domains lists from npm packages
// Packages:
// - disposable-email-domains (MIT License) - https://github.com/disposable/disposable-email-domains
// - disposable-email (MIT License) - https://github.com/andreis/disposable
// - email-disposable (MIT License) - https://github.com/gtkppr/email-disposable
// All packages use MIT License - See LICENSE files for details
let disposableEmailDomainsListPromise = null;
let disposableEmailDomainsList = [];
let disposableEmailBlocklistPromise = null;
let disposableEmailBlocklist = [];
let disposableEmailListPromise = null;
let disposableEmailList = [];
let emailDisposableListPromise = null;
let emailDisposableList = [];

// Lazy load the disposable-email-domains package list
const loadDisposableEmailDomains = async () => {
  if (disposableEmailDomainsList.length > 0) {
    return disposableEmailDomainsList;
  }
  
  if (!disposableEmailDomainsListPromise) {
    disposableEmailDomainsListPromise = (async () => {
      try {
        // The package exports a JSON file, so we read it directly using fs
        // This is more reliable than import with JSON attributes across Node.js versions
        const fs = await import('fs');
        const path = await import('path');
        const { fileURLToPath } = await import('url');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        // Try to find the package JSON file
        const packagePath = path.resolve(__dirname, '../node_modules/disposable-email-domains/index.json');
        
        if (fs.existsSync(packagePath)) {
          const jsonData = fs.readFileSync(packagePath, 'utf8');
          const list = JSON.parse(jsonData);
          
          if (Array.isArray(list) && list.length > 0) {
            disposableEmailDomainsList = list;
            // Package loaded successfully
          }
        }
      } catch (error) {
        // Package not available or failed to load - will use custom list only
        // Error handled silently
      }
      return disposableEmailDomainsList;
    })();
  }
  
  return disposableEmailDomainsListPromise;
};

// Lazy load the disposable-email-blocklist package list
const loadDisposableEmailBlocklist = async () => {
  if (disposableEmailBlocklist.length > 0) {
    return disposableEmailBlocklist;
  }
  
  if (!disposableEmailBlocklistPromise) {
    disposableEmailBlocklistPromise = (async () => {
      try {
        // The package exports a JSON file, so we read it directly using fs
        const fs = await import('fs');
        const path = await import('path');
        const { fileURLToPath } = await import('url');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        // Try to find the package JSON file (check common locations)
        const packagePath1 = path.resolve(__dirname, '../node_modules/disposable-email-blocklist/index.json');
        const packagePath2 = path.resolve(__dirname, '../node_modules/disposable-email-blocklist/domains.json');
        const packagePath3 = path.resolve(__dirname, '../node_modules/disposable-email-blocklist/blocklist.json');
        
        let packagePath = null;
        if (fs.existsSync(packagePath1)) {
          packagePath = packagePath1;
        } else if (fs.existsSync(packagePath2)) {
          packagePath = packagePath2;
        } else if (fs.existsSync(packagePath3)) {
          packagePath = packagePath3;
        }
        
        if (packagePath) {
          const jsonData = fs.readFileSync(packagePath, 'utf8');
          const list = JSON.parse(jsonData);
          
          if (Array.isArray(list) && list.length > 0) {
            disposableEmailBlocklist = list;
            // Package loaded successfully
          }
        }
      } catch (error) {
        // Package not available or failed to load - will use other lists
        // Error handled silently
      }
      return disposableEmailBlocklist;
    })();
  }
  
  return disposableEmailBlocklistPromise;
};

// Lazy load the disposable-email package list
const loadDisposableEmail = async () => {
  if (disposableEmailList.length > 0) {
    return disposableEmailList;
  }
  
  if (!disposableEmailListPromise) {
    disposableEmailListPromise = (async () => {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const { fileURLToPath } = await import('url');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        // Try to find the package JSON file (check common locations)
        const packagePath1 = path.resolve(__dirname, '../node_modules/disposable-email/domains.json');
        const packagePath2 = path.resolve(__dirname, '../node_modules/disposable-email/index.json');
        const packagePath3 = path.resolve(__dirname, '../node_modules/disposable-email/list.json');
        
        let packagePath = null;
        if (fs.existsSync(packagePath1)) {
          packagePath = packagePath1;
        } else if (fs.existsSync(packagePath2)) {
          packagePath = packagePath2;
        } else if (fs.existsSync(packagePath3)) {
          packagePath = packagePath3;
        }
        
        if (packagePath) {
          const jsonData = fs.readFileSync(packagePath, 'utf8');
          const list = JSON.parse(jsonData);
          
          if (Array.isArray(list) && list.length > 0) {
            disposableEmailList = list;
          }
        }
      } catch (error) {
        // Package not available or failed to load - will use other lists
      }
      return disposableEmailList;
    })();
  }
  
  return disposableEmailListPromise;
};

// Lazy load the email-disposable package list
const loadEmailDisposable = async () => {
  if (emailDisposableList.length > 0) {
    return emailDisposableList;
  }
  
  if (!emailDisposableListPromise) {
    emailDisposableListPromise = (async () => {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const { fileURLToPath } = await import('url');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        // Try to find the package JSON file (check common locations)
        const packagePath1 = path.resolve(__dirname, '../node_modules/email-disposable/domains.json');
        const packagePath2 = path.resolve(__dirname, '../node_modules/email-disposable/index.json');
        const packagePath3 = path.resolve(__dirname, '../node_modules/email-disposable/list.json');
        const packagePath4 = path.resolve(__dirname, '../node_modules/email-disposable/blocklist.json');
        
        let packagePath = null;
        if (fs.existsSync(packagePath1)) {
          packagePath = packagePath1;
        } else if (fs.existsSync(packagePath2)) {
          packagePath = packagePath2;
        } else if (fs.existsSync(packagePath3)) {
          packagePath = packagePath3;
        } else if (fs.existsSync(packagePath4)) {
          packagePath = packagePath4;
        }
        
        if (packagePath) {
          const jsonData = fs.readFileSync(packagePath, 'utf8');
          const list = JSON.parse(jsonData);
          
          if (Array.isArray(list) && list.length > 0) {
            emailDisposableList = list;
          }
        }
      } catch (error) {
        // Package not available or failed to load - will use other lists
      }
      return emailDisposableList;
    })();
  }
  
  return emailDisposableListPromise;
};

// Comprehensive list of disposable/temporary/fake email domains
// Using disposable-email-domains + disposable-email + email-disposable packages + custom list for maximum coverage
const customDisposableEmailDomains = [
  // Tempumail and variants
  'tempumail.com', 'temp-mail.com', 'tempmail.com', 'temp-mail.org', 'temp-mail.io', 
  'tempmail.net', 'tempmail.de', 'tempmail.us', 'tempmail.org', 'tempemail.com',
  'tempm.com', 'tempr.email', 'tempinbox.com', 'tempemailaddress.com',
  
  // 10 minute mail variants
  '10minutemail.com', '10minutemail.net', '10minemail.com', '10minutemail.org',
  '10minutemail.co.uk', '20minutemail.com', '30minutemail.com',
  
  // Guerrilla mail
  'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamailblock.com',
  'guerrillamail.biz', 'guerrillamail.de', 'grr.la', 'sharklasers.com',
  
  // Mailinator
  'mailinator.com', 'mailinator.net', 'mailinator2.com', 'mailinator.org',
  
  // Maildrop
  'maildrop.cc', 'maildrop.cf', 'maildrop.ga', 'maildrop.gq', 'maildrop.ml',
  'maildrop.tk',
  
  // Yopmail
  'yopmail.com', 'yopmail.net', 'yopmail.fr', 'yopmail.org',
  
  // Trash/disposable mail
  'trashmail.com', 'trashmail.net', 'trashmail.org', 'trashmail.de',
  'throwaway.email', 'throwawaymail.com', 'disposablemail.com',
  'dispostable.com', 'disposemail.com', 'disposable-email.ml',
  
  // GetNada and similar
  'getnada.com', 'getnada.cc', 'getnowmail.com',
  
  // Mailnesia
  'mailnesia.com', 'mailcatch.com', 'mailexpire.com',
  
  // Fake inbox services
  'fakeinbox.com', 'fakeinbox.net', 'fakebox.email',
  'fake-mail.com', 'fake-email.com', 'fakemail.net', 'fakemail.fr',
  'fakemailgenerator.com', 'fakemailz.com',
  
  // Email on deck and similar
  'emailondeck.com', 'emailsensei.com', 'emailtemporanea.com', 'emailtemporanea.net',
  
  // Mohmal and similar
  'mohmal.com', 'mohmal.tech', 'mohmal.im',
  
  // Misc temp services
  'mintemail.com', 'mytemp.email', 'mytrashmail.com', 'mytempmail.com',
  'tmpmail.net', 'tmpmail.org', 'temp-link.net',
  'rootfest.net', 'tmails.net', 'spamgourmet.com', 'spambox.us',
  'incognitomail.com', 'incognitomail.net', 'anonymousemail.me',
  'hidemail.de', 'jetable.org', 'kasmail.com',
  
  // Burner and similar
  'burnermail.io', 'bugmenot.com', 'bumpymail.com',
  
  // Fake educational domains (common fake .edu-like domains)
  'edu-mail.com', 'fakeedu.com', 'student-mail.com', 'edu-email.com',
  'college-mail.com', 'university-mail.com', 'school-email.com',
  'edumail.com', 'studentemail.com', 'academicemail.com',
  
  // Test/example/fake domains
  'test.com', 'test.net', 'test.org', 'test.test', 'email.test',
  'example.com', 'example.net', 'example.org',
  'localhost', 'localhost.com',
  'fakeemail.com', 'fakeemail.net', 'fakeemail.org',
  'fakeaddress.com', 'fakeaddress.net',
  'noemail.com', 'nomail.com', 'nowhere.com',
  
  // Spam/junk domains
  'spam.com', 'spambox.com', 'spamfree.com', 'spamoff.de',
  'spamcon.org', 'spamcannon.com', 'spamcero.com',
  'junk.com', 'junkmail.com', 'junkmail.ga',
  
  // Other disposable services
  'airsworld.net', 'albill.com', 'allfreemail.net', 'allwebemails.com', 'aminating.com', 'anonbox.net', 'anonymbox.com', 'antichef.com', 'antispam.de',
  'bltiwd.com', 'bwmyga.com',
  'binkmail.com', 'bobmail.info', 'bodhi.lawlita.com',
  'bomnet.net',
  'zudpck.com',
  'cdnmia.com', 'chithinh.com', 'cloud-temp.com', 'concu.net', 'correotemporal.org', 'crazymailing.com',
  'deadaddress.com', 'denipl.net', 'despam.it', 'devnullmail.com',
  'discardmail.com', 'discardmail.de', 'draughtier.com', 'dump-email.info',
  'dubokutv.com', 'dubokutv.net', 'dubokutv.org',
  'dulich84.com',
  'e4ward.com', 'eacademia.uk', 'easymailer.live', 'easytrashmail.com', 'emltmp.com',
  'embekhoe.com', 'etubemail.com',
  'eyepaste.com',   'filzmail.com', 'fornow.eu',
  'forexzig.com', 'fusioninbox.com', 'fxzig.com', 'getairmail.com', 'givmail.com', 'groklan.com', 'harakirimail.com',
  'hetzez.com', 'hook2ad.com', 'horizonspost.com', 'huongdanfb.com', 'illubd.com', 'imails.info', 'inboxclean.com', 'inboxclean.org',
  'inboxorigin.com', 'ket-qua.org',
  'keepmymail.com', 'koszmail.pl', 'letthemeatspam.com',
  'lnovic.com', 'lol.ovpn.to', 'lookugly.com', 'lopl.co.cc',
  'mail-temp.com', 'mail-temporaire.fr', 'mail2rss.org',
  'mailin8r.com', 'mailmagnet.co', 'mailmetrash.com', 'mailmoat.com',
  'mailshan.com', 'mkzaso.com', 'mrotzis.com',
  'nickmxh.com',
  'mailscrap.com', 'mailshell.com', 'mailtothis.com',
  'mailzilla.com', 'mailzilla.org', 'mbx.cc',
  'momentics.ru', 'mt2009.com', 'mypartyclip.de',
  'mycreativeinbox.com', 'myphantomemail.com', 'neverbox.com', 'no-spam.ws',
  'account.xn--yaho-sqa.com', 'best.xn--yaho-sqa.com',
  'dev.nondon.store', 'edu.xn--yaho-sqa.com', 'edu.zikzak.site',
  'nondon.store', 'noriina.shop',
  'op.xn--yaho-sqa.com', 'pro.zikzak.site',
  's3k.net', 'search4gpt.com', 'soc123.net',
  'student.london.store', 'student.nondon.store',
  'nobulk.com', 'noclickemail.com', 'nogmailspam.info',
  'nomail.xl.cx', 'nomail2me.com', 'nospam.ze.tc',
  'openmail.pro', 'ozsaip.com', 'pixoledge.net',
  'tiksofi.uk', 'tiktakgrabber.com',
  
  // Tmailor.com - temporary email service with 500+ rotating domains
  'tmailor.com', 'tmailor.net', 'tmailor.org', 'tmailor.io',
  'nospam4.us', 'nospamfor.us', 'nospamthanks.info',
  'nowmymail.com', 'oneoffemail.com', 'onewaymail.com',
  'pookmail.com', 'proxymail.eu', 'prtnx.com',
  'putthisinyourspamdatabase.com', 'quickinbox.com', 'rcpt.at',
  'reallymymail.com', 'receiveee.com', 'recode.me',
  'rtrtr.com', 'rearised.com', 's0ny.net', 'safe-mail.net', 'solarnyx.com',
  'selfdestructingmail.com', 'shortmail.net', 'sibmail.com',
  'sinnlos-mail.de', 'slapsfromlastnight.com', 'slaskpost.se',
  'sneakemail.com', 'snkmail.com', 'sofort-mail.de',
  'solvemail.info', 'spambob.com', 'spambog.com',
  'spambox.me', 'spamcowboy.com', 'spamday.com',
  'spamex.com', 'spamfree24.com', 'spamfree24.de',
  'spamfree24.eu', 'spamfree24.info', 'spamfree24.net',
  'spamfree24.org', 'spamherelots.com', 'spamhereplease.com',
  'spamhole.com', 'spaml.com', 'spaml.de',
  'spammotel.com', 'spamobox.com', 'spamslicer.com',
  'spamspot.com', 'spamthis.co.uk', 'spamtrail.com',
  'speed.1s.fr', 'supermailer.jp', 'suremail.info',
  'teewars.org', 'teleworm.com', 'teleworm.us',
  'tempalias.com', 'tempe-mail.com', 'tempemail.biz',
  'tempemail.co.za', 'tempemail.net', 'tempemails.net',
  'tempinbox.co.uk', 'tempmail.co', 'tempmail.it',
  'tempmail2.com', 'tempmaildemo.com', 'tempmailer.com',
  'tempmailer.de', 'tempomail.fr', 'temporarily.de',
  'temporarioemail.com.br', 'temporaryemail.net', 'temporaryemail.us',
  'temporaryforwarding.com', 'temporaryinbox.com', 'temporarymailaddress.com',
  'thanksnospam.info', 'thankyou2010.com', 'thecloudindex.com',
  'tilien.com', 'tittbit.in', 'tmail.ws',
  'tmailinator.com', 'tradermail.info', 'trash-amil.com',
  'trash-mail.at', 'trash-mail.com', 'trash-mail.de',
  'trash2009.com', 'trashemail.de', 'trashymail.com',
  'trillianpro.com', 'turual.com', 'twinmail.de',
  'uggsrock.com', 'upliftnow.com', 'uplipht.com', 'upphim.net',
  'venompen.com', 'vertexinbox.com', 'veryrealemail.com', 'viditag.com',
  'viewcastmedia.com', 'viewcastmedia.net', 'viewcastmedia.org',
  'webm4il.info', 'wegwerfemail.de', 'wegwerfmail.de',
  'wegwerfmail.net', 'wegwerfmail.org', 'wetrainbayarea.com',
  'wetrainbayarea.org', 'wh4f.org', 'whyspam.me',
  'willselfdestruct.com', 'winemaven.info', 'wronghead.com',
  'wuzup.net', 'wuzupmail.net', 'www.e4ward.com',
  'wnbaldwy.com', 'www.mailinator.com', 'wwwnew.eu', 'x.ip6.li',
  'xagloo.com', 'xarme.org', 'xemaps.com', 'xents.com',
  'xkxkud.com', 'xmaily.com', 'xoxy.net', 'yapped.net',
  'yzcalo.com',
  'yogamaven.com', 'yuurok.com', 'zehnminuten.de',
  'zehnminutenmail.de', 'zippymail.info', 'zoaxe.com',
  'zoemail.com', 'zomg.info',
  'xn--yaho-sqa.com', 'zikzak.site'
];

// Combine package lists with custom list for comprehensive coverage
// This will be populated when loadDisposableEmailDomains and loadDisposableEmailBlocklist are called
let disposableEmailDomainsSet = new Set(customDisposableEmailDomains);

// Trusted email domains - these are well-known legitimate email providers
// Domains not in this list will have a delay added to slow down potential abuse
const TRUSTED_DOMAINS = [
  // Major email providers
  'gmail.com', 'googlemail.com',
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
  'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de', 'yahoo.co.jp',
  'aol.com', 'aol.fr', 'aol.de',
  'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'proton.me',
  'mail.com', 'email.com', 'inbox.com', 'gmx.com', 'gmx.de', 'gmx.fr',
  'zoho.com', 'zohomail.com',
  'yandex.com', 'yandex.ru', 'yandex.ua',
  'mail.ru', 'inbox.ru', 'list.ru',
  'qq.com', '163.com', '126.com', 'sina.com', 'sina.cn',
  'rediffmail.com', 'rediff.com',
  'naver.com', 'daum.net',
  'web.de', 't-online.de', 'gmx.net',
  'orange.fr', 'wanadoo.fr', 'laposte.net',
  'libero.it', 'virgilio.it', 'alice.it',
  'terra.com.br', 'uol.com.br', 'bol.com.br',
  'cox.net', 'sbcglobal.net', 'att.net', 'verizon.net', 'comcast.net',
  'sky.com', 'btinternet.com', 'talktalk.net',
  // Corporate/enterprise domains (common patterns)
  'microsoft.com', 'apple.com', 'amazon.com', 'facebook.com', 'meta.com',
  'linkedin.com', 'twitter.com', 'x.com',
  // Educational domains
  'edu', 'ac.uk', 'edu.au', 'edu.ca',
  // Government domains
  'gov', 'gov.uk', 'gov.au', 'gov.ca',
];

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Validate email format using strict regex
 */
export const validateEmailFormat = (email) => {
  // More strict email regex
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return false;
  }
  
  // Additional checks
  const [localPart, domain] = email.split('@');
  
  // Local part should not be empty or just dots
  if (!localPart || localPart.length < 1 || localPart === '.') {
    return false;
  }
  
  // Domain should have at least one dot
  if (!domain || !domain.includes('.')) {
    return false;
  }
  
  // Domain TLD should be at least 2 characters
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) {
    return false;
  }
  
  return true;
};

/**
 * Check if email is from a disposable/temporary email service
 * Also checks for common patterns in fake domains
 */
export const isDisposableEmail = async (email) => {
  try {
    const domain = email.split('@')[1]?.toLowerCase().trim();
    
    if (!domain) {
      return false;
    }
    
    // FIRST: Check for tmailor domains immediately (before package loading)
    // This catches all tmailor variations including subdomains
    if (domain.includes('tmailor') || 
        domain === 'tmailor.com' || 
        domain === 'tmailor.net' || 
        domain === 'tmailor.org' || 
        domain === 'tmailor.io' ||
        domain.endsWith('.tmailor.com') ||
        domain.endsWith('.tmailor.net') ||
        domain.endsWith('.tmailor.org') ||
        domain.endsWith('.tmailor.io')) {
      console.log(`❌ Tmailor domain blocked: ${domain}`);
      return true;
    }
    
    // Ensure all package domains are loaded
    await Promise.all([
      loadDisposableEmailDomains(),
      loadDisposableEmailBlocklist(),
      loadDisposableEmail(),
      loadEmailDisposable()
    ]);
    
    // Combine all lists: all packages + custom list
    const allDisposableDomains = [
      ...disposableEmailDomainsList,
      ...disposableEmailBlocklist,
      ...disposableEmailList,
      ...emailDisposableList,
      ...customDisposableEmailDomains
    ];
    
    // Update set with all domains
    disposableEmailDomainsSet = new Set(allDisposableDomains);
    
    // Check exact match in disposable domains set (from all packages + custom list)
    if (disposableEmailDomainsSet.has(domain)) {
      console.log(`❌ Domain in blacklist: ${domain}`);
      return true;
    }
    
    // Check for common fake domain patterns
    const fakePatterns = [
    /^temp.*mail/i,           // tempXmail, tempmailXX
    /^fake.*mail/i,           // fakemail, fakemailXX
    /^trash.*mail/i,          // trashmail variations
    /^spam.*mail/i,           // spammail variations
    /^throwaway/i,            // throwaway variations
    /^dispose/i,              // dispose, disposable
    /^guerrilla/i,            // guerrilla variations
    /^mailinator/i,           // mailinator variations
    /tmailor/i,               // tmailor.com and all tmailor variations (anywhere in domain)
    /^.*\.edu\..*$/i,         // fake .edu domains (e.g., temp.edu.com)
    /^test\d*\./i,            // test1.com, test2.com, etc.
    /^email-?temp/i,          // email-temp, emailtemp
    /^temp-?email/i,          // temp-email, tempemail
    /^.*-?temp\..*$/i,        // anything-temp.com
    /^.*-?fake\..*$/i,        // anything-fake.com
    /^.*-?spam\..*$/i,        // anything-spam.com
    /^throw.*away/i,          // throwXaway
    /^burner/i,               // burner emails
    /^temporary/i,            // temporary variations
    /^disposable/i,           // disposable variations
  ];
  
    for (const pattern of fakePatterns) {
      if (pattern.test(domain)) {
        console.log(`❌ Domain matches fake pattern: ${domain}`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    // If disposable check fails, be strict - reject the email
    console.error('❌ Error checking disposable email:', error);
    console.error('❌ Domain being checked:', email.split('@')[1]);
    // Return true to block the email if we can't verify it's not disposable
    return true; // Block on error to be safe
  }
};

/**
 * Check if email domain has valid MX records (mail servers) and DNS records
 * This helps identify fake/non-existent email domains
 */
export const checkEmailDomain = async (email) => {
  try {
    // Extract domain from email
    const domain = email.split('@')[1];
    
    if (!domain) {
      return {
        valid: false,
        message: 'Invalid email format. Missing domain.'
      };
    }

    // Check if domain is trusted - if not, add delay for risky domains
    const domainLower = domain.toLowerCase();
    const isTrusted = TRUSTED_DOMAINS.some(trusted => {
      // Check exact match or if domain ends with trusted domain (e.g., mail.gmail.com)
      return domainLower === trusted || domainLower.endsWith('.' + trusted);
    });

    if (!isTrusted) {
      console.log(`⏳ Domain ${domain} is not in trusted list, adding delay for security...`);
      await delay(20000); // 20 seconds delay for risky domains
      console.log(`✅ Delay completed, proceeding with domain validation for ${domain}`);
    } else {
      console.log(`✅ Domain ${domain} is trusted, proceeding without delay`);
    }

    console.log(`🔍 Checking email domain: ${domain}`);

    // First, check if domain exists at all (has any DNS records)
    let domainExists = false;
    try {
      await resolve4(domain);
      console.log(`✅ Domain ${domain} exists (has A records)`);
      domainExists = true;
    } catch (dnsError) {
      if (dnsError.code === 'ENOTFOUND') {
        console.warn(`❌ Domain not found: ${domain}`);
        return {
          valid: false,
          message: 'Email domain does not exist. Please enter a valid email address.'
        };
      }
      // Continue to MX check even if A record lookup fails
      console.log(`⚠️ A record lookup failed, checking MX records: ${dnsError.code}`);
    }

    // Check if domain has MX records (mail servers)
    try {
      const addresses = await resolveMx(domain);
      
      if (addresses && addresses.length > 0) {
        console.log(`✅ Email domain validated: ${domain} has ${addresses.length} mail server(s)`);
        console.log(`📬 Mail servers:`, addresses.map(a => a.exchange).join(', '));
        return {
          valid: true,
          message: 'Email domain is valid'
        };
      } else {
        console.warn(`❌ Email domain has no MX records: ${domain}`);
        return {
          valid: false,
          message: 'This email domain cannot receive emails. Please enter a valid email address.'
        };
      }
    } catch (dnsError) {
      // DNS lookup failed - domain doesn't exist or has no MX records
      console.warn(`❌ MX lookup failed for domain: ${domain}`, dnsError.code);
      
      if (dnsError.code === 'ENOTFOUND') {
        return {
          valid: false,
          message: 'Email domain does not exist. Please enter a valid email address.'
        };
      }
      
      if (dnsError.code === 'ENODATA') {
        return {
          valid: false,
          message: 'This email domain cannot receive emails. Please enter a valid email address.'
        };
      }
      
      if (dnsError.code === 'ESERVFAIL' || dnsError.code === 'ETIMEOUT') {
        // Server/network error - reject for safety
        console.warn('❌ DNS server error, rejecting for safety:', dnsError.code);
        return {
          valid: false,
          message: 'Unable to verify email domain at this time. Please try again later or use a different email.'
        };
      }
      
      // For any other DNS errors, be strict - reject the email
      console.warn('❌ Unknown DNS error, rejecting email for safety:', dnsError.code);
      return {
        valid: false,
        message: 'Unable to verify email domain. Please check your email address and try again.'
      };
    }
  } catch (error) {
    // Unexpected error - be strict, don't allow
    console.error('❌ Email validation error:', error);
    return {
      valid: false,
      message: 'Unable to validate email. Please check your email address and try again.'
    };
  }
};

/**
 * Comprehensive email validation with strict checks
 */
export const validateEmail = async (email) => {
  console.log('🔍 Email Validation Starting...');
  console.log('📧 Original email:', email);
  
  // Trim and lowercase
  email = email.trim().toLowerCase();
  console.log('📧 Normalized email:', email);
  
  // 1. Check format (STRICT)
  console.log('✓ Step 1/3: Checking email format...');
  if (!validateEmailFormat(email)) {
    console.warn(`❌ Format validation failed for: ${email}`);
    return {
      valid: false,
      message: 'Invalid email format. Please enter a valid email address (e.g., user@example.com).'
    };
  }
  console.log('✅ Step 1/3: Format is valid');

  // 2. Check if disposable/temporary email (STRICT)
  console.log('✓ Step 2/3: Checking for disposable/temporary email domains...');
  const isDisposable = await isDisposableEmail(email);
  if (isDisposable) {
    console.warn(`❌ Disposable email rejected: ${email}`);
    return {
      valid: false,
      message: 'Temporary/disposable email addresses are not allowed. Please use your real email address.'
    };
  }
  console.log('✅ Step 2/3: Not a disposable email');

  // 3. Check domain (has mail servers and exists) - STRICT
  console.log('✓ Step 3/3: Verifying domain exists and has mail servers...');
  const domainCheck = await checkEmailDomain(email);
  
  if (domainCheck.valid) {
    console.log(`✅ ✅ ✅ EMAIL FULLY VALIDATED: ${email}`);
    console.log('📬 Domain exists, has mail servers, ready to receive emails');
  } else {
    console.warn(`❌ ❌ ❌ EMAIL REJECTED: ${email}`);
    console.warn(`❌ Reason: ${domainCheck.message}`);
  }
  
  return domainCheck;
};

