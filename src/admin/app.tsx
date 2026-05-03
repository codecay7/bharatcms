import './extensions/custom.css';
import type { StrapiApp } from '@strapi/strapi/admin';
import favicon from './extensions/favicon.png';
import logo from './extensions/logo.svg';

export default {
  config: {
    auth: {
      logo: logo,
    },
    
    head: {
      favicon: favicon,
      title: 'BharatCMS',
    },
    
    menu: {
      logo: logo,
    },
    
    theme: {
      light: {
        colors: {
          primary100: '#e6faff',
          primary200: '#b3f0ff',
          primary500: '#00d4ff',
          primary600: '#0891b2',
          primary700: '#0e7490',
          buttonPrimary500: '#00d4ff',
          buttonPrimary600: '#0891b2',
        },
      },
      dark: {
        colors: {
          primary100: '#0a3d4a',
          primary200: '#0e5a6e',
          primary500: '#00d4ff',
          primary600: '#0891b2',
          primary700: '#0e7490',
          buttonPrimary500: '#00d4ff',
          buttonPrimary600: '#0891b2',
        },
      },
    },
    
    locales: ['en'],
    
    // Hide Strapi marketing/upsell
    tutorials: false,
    notifications: { releases: false },
    
    translations: {
      en: {
        'app.components.LeftMenu.navbrand.title': 'BharatCMS',
        'app.components.LeftMenu.navbrand.workplace': "India's Headless CMS 🇮🇳",
        'Auth.form.welcome.title': 'Welcome to BharatCMS!',
        'Auth.form.welcome.subtitle': 'Login to manage your content',
        'app.components.HomePage.welcome': 'Welcome to BharatCMS',
        'app.components.HomePage.welcome.again': 'Namaste! Welcome back 🙏',
        'app.components.HomePage.welcomeBlock.content': "India's first AI-powered headless CMS",
        'Settings.application.title': 'BharatCMS Settings',
      },
    },
  },
  
  bootstrap(app: StrapiApp) {
    console.log('🇮🇳 BharatCMS Admin Loaded — Made with ❤️ in India');
  },
};
