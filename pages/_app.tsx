import type { AppProps } from 'next/app';
import { AuthProvider } from '../app/context/AuthContext';
import { ThemeProvider } from '../app/context/ThemeContext';
import '../app/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;
