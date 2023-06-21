import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import { PageLayout } from "~/components/layout";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "~/components/header";

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
        <Component {...pageProps} />
      </PageLayout>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
