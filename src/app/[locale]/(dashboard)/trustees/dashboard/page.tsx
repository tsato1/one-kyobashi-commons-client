import { getTranslations } from "next-intl/server";

const TrusteesDashboardPage = async () => {
  const t = await getTranslations("private.trustees.dashboard")

  return (
    <div className="size-full flex items-center justify-center mt-10">
      ダッシュボード
    </div>
  )
}

export default TrusteesDashboardPage;