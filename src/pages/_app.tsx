import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import { PageLayout } from "~/components/layout";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "~/components/header";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Echo</title>
        <meta name="description" content="A place to share links and ideas." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <Header />
        <Toaster position="bottom-center" />
        <Component {...pageProps} />
      </PageLayout>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
