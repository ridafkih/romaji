import Head from "next/head";

import Header from "@components/Header";
import Table from "@components/Table";

const Index = () => {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="flex flex-col h-full">
        <Header />
        <div className="flex-grow grid place-items-center">
          <Table />
        </div>
      </div>
    </>
  );
};

export default Index;
