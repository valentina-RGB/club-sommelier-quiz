import { useQuestionnaireByIDQuery } from "@/api/query/cuestions.queries";

import QuestionnaireDetail from "@/common/widgets/admin/quetionnaire/quetionnaire-details.widget";

export default function QuestionnaireDetailPage() {
  return (
    
    <QuestionnaireDetail
      useQuestionnaireByIDQuery={useQuestionnaireByIDQuery}
    />
  );
}