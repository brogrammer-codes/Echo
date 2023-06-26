import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="overflow-none flex h-screen justify-center">
      <div className="md:max-w-7xl w-full border-x border-slate-100/10 h-full">
        {props.children}
      </div>
    </main>
  );
};