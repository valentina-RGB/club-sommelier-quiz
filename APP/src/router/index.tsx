import App from "@/App";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { QuestionsView } from "@/views/clients/question/questions-client.view";
import { NotFoundPage } from "@/common/utils/404";
import Navbar from "@/common/widgets/admin/nav_widget";
import HomeCuestion from "@/views/admin/questionnaire/questionnaire-view";
import { QuizLoader } from "@/common/atoms/QuizLoader";
import { useAppLoading } from "@/common/hooks/useAppLoading";
import { Suspense } from "react";
import QuestionnaireDetailPage from "@/views/admin/questionnaire/questionnaire-details.view";
import EventView from "@/views/admin/event/events-view";
import HomeQuestionsView from "@/views/admin/question/questions-view";
import { WaitingViewTest } from "@/views/clients/question/waiting-room.test.view";
import QuestionnaireFormView from "@/common/widgets/admin/quetionnaire/form-quetionnaire.widgest";
import QuestionnaireEditContainer from "@/views/admin/questionnaire/questionnaire-edit.view";
import AdminControlView from "@/views/admin/questionnaire/questionnaire-control.view";
import LoginPage from "@/views/home/login-view";
import LandingPage from "@/views/home/landing-view";
import ContactPage from "@/views/home/contact-view";
import { HomeView } from "@/views/home/home-view";
import PrivateRoute from "./token-route";



function AppWithLoading() {
    const { isLoading } = useAppLoading(3000);

    if (isLoading) {
        return <QuizLoader />;
    }

    return <App />;
}

function SuspenseLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
            <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[var(--text-secondary)]">Cargando...</span>
            </div>
        </div>
    );
}

export default function AuthRoutes() {
    return (
        <Router>
            <Suspense fallback={<SuspenseLoader />}>
                <Routes>
                    <Route path="/" element={<AppWithLoading />}>
                        <Route path="404" element={<NotFoundPage />} />
                        <Route element={<HomeView />} />
                        <Route path="client" element={<HomeView />} />
                        <Route path="waiting" element={<WaitingViewTest />} />
                        <Route path="questions" element={<QuestionsView />} />

                        {/* RUTA LANDING AGREGADA */}
                        <Route index element={<LandingPage />} />
                        <Route path="contact" element={<ContactPage />} />



                        {/* LOGIN */}
                        <Route path="login" element={<LoginPage />} />
                        <Route element={<PrivateRoute/>}>
                            {/* <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}> */}
                            <Route path="admin" element={<Navbar />}>
                                <Route index element={<HomeCuestion />} />
                                <Route path="event" element={<EventView />} />
                                <Route path="questions" element={<HomeQuestionsView />} />
                                <Route path="questionnaireDetails" element={<QuestionnaireDetailPage />} />
                                <Route path="questionnaire/create" element={<QuestionnaireFormView />} />
                                <Route path="questionnaire/edit/:id" element={<QuestionnaireEditContainer />} />
                                <Route path="control" element={<AdminControlView />} />

                            </Route>
                            {/* </Route> */}
                        </Route>

                        </Route>
                        <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
            </Suspense>
        </Router>
    );
}