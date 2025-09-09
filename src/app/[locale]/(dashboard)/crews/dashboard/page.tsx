import { getTranslations } from "next-intl/server";

const CrewsDashboardPage = async () => {
  const t = await getTranslations("private.crews.dashboard")

  return (
    <div className="size-full flex items-center justify-center mt-10">
      ダッシュボード
    </div>
  )
}

export default CrewsDashboardPage;