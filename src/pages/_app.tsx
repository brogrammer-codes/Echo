import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import { PageLayout } from "~/components/layout";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Echo</title>
        <meta name="description" content="A place to share links and ideas." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <nav>Check it out I am a nav</nav>
        <Component {...pageProps} />
      </PageLayout>
    </>
  );
};

export default api.withTRPC(MyApp);
