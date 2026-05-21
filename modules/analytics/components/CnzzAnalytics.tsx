"use client";

import Script from "next/script";
import { analyticsConfig } from "@/project/config/analytics";

export function CnzzAnalytics() {
  const { cnzz } = analyticsConfig;
  const siteScriptId = String(cnzz.siteScriptId);
  const teamScriptId = String(cnzz.teamScriptId);

  if (!cnzz.enabled || !siteScriptId) {
    return null;
  }

  return (
    <>
      <Script id="cnzz-init" strategy="lazyOnload">
        {`var _czc = _czc || [];`}
      </Script>
      <Script id="cnzz-account" strategy="lazyOnload">
        {`_czc.push(["_setAccount", ${JSON.stringify(siteScriptId)}]);`}
      </Script>
      <Script
        id="cnzz-site"
        src={`https://v1.cnzz.com/z.js?id=${encodeURIComponent(siteScriptId)}&async=1`}
        strategy="lazyOnload"
      />
      {teamScriptId !== siteScriptId ? (
        <Script
          id="cnzz-team"
          src={`https://v1.cnzz.com/z.js?id=${encodeURIComponent(teamScriptId)}&async=1`}
          strategy="lazyOnload"
        />
      ) : null}
    </>
  );
}
