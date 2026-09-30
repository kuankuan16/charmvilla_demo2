import type { Metadata } from "next";
import AccountClient from "@/components/account/AccountClient";

export const metadata: Metadata = { title: "會員｜CHARM VILLA", description: "登入或註冊 CHARM VILLA 會員，管理個人資料、地址與訂單。", alternates: { canonical: "/account" } };

export default function AccountPage() {
  return <main id="catalog-main" className="account-page" tabIndex={-1}><AccountClient /></main>;
}
