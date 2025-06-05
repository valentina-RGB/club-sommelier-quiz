import { useState, useEffect, useMemo } from 'react';
import {Play,SkipForward,Square,Users,CheckCircle,Clock,BookOpen,AlertCircle,Wifi,WifiOff} from 'lucide-react';
import { useEventSocketAdmin } from '@/common/hooks/useEventSocket';
import { useSearchParams } from 'react-router-dom';
import AnimatedBackground from '@/common/atoms/animated-background';

export default function AdminControlView() {
    const [searchParams] = useSearchParams();
    const accessCode = searchParams.get("accessCode");
    if (!accessCode) return <div>Error: Código de acceso no proporcionado</div>;

    const [timeElapsed, setTimeElapsed] = useState(0);
    const [connectedParticipants] = useState(8);
    const {isConnected,eventStarted,currentQuestion,noMoreQuestions,eventEnded,startEvent,nextQuestion,endEvent} = useEventSocketAdmin(accessCode);

    useEffect(() => {
        let interval: string | number | NodeJS.Timeout | undefined;

        if (eventStarted && !eventEnded && currentQuestion) {
            const startTime = currentQuestion.timestamp || Date.now();
            interval = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        } else {
            setTimeElapsed(0);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [currentQuestion, eventStarted, eventEnded]);

    const connectionStatus = useMemo(() => {
        return isConnected ? 'connected' : 'disconnected';
    }, [isConnected]);

    console.log('Connection status:', connectionStatus);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getEventStatus = () => {
        if (eventEnded) return 'ended';
        if (eventStarted) return 'active';
        return 'waiting';
    };

    const eventStatus = getEventStatus();

    return (
        <div className="min-h-screen relative ">
            <AnimatedBackground />
            <div className="max-w-6xl  mx-auto bg-black z-10 space-y-6">
                {/* Header */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between">
                        <div >
                            <h1 className="text-2xl font-bold text-white mb-2">Panel de Control</h1>
                            <p className="text-blue-200">
                                Código de acceso:
                                <span className="font-mono bg-blue-500/20 px-2 py-1 rounded ml-2">
                                    {accessCode}
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                {connectionStatus === 'connected' ? (
                                    <>
                                        <Wifi className="w-5 h-5 text-green-400" />
                                        <span className="text-green-400 text-sm">Conectado</span>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff className="w-5 h-5 text-red-400" />
                                        <span className="text-red-400 text-sm">Desconectado</span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center space-x-2 bg-blue-500/20 px-3 py-1 rounded-lg">
                                <Users className="w-4 h-4 text-blue-300" />
                                <span className="text-blue-300 text-sm">{connectedParticipants}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Panel Principal de Control */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                            <BookOpen className="w-5 h-5" />
                            <span>Control del Evento</span>
                        </h2>

                        {eventStatus === 'waiting' && (
                            <div className="space-y-4">
                                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <AlertCircle className="w-4 h-4 text-blue-400" />
                                        <span className="text-blue-200 text-sm">Evento no iniciado</span>
                                    </div>
                                    <p className="text-blue-100 text-sm">
                                        Los participantes están esperando. Presiona el botón para comenzar.
                                    </p>
                                </div>

                                <button
                                    onClick={startEvent}
                                    disabled={connectionStatus !== 'connected'}
                                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-green-500/25"
                                >
                                    <Play className="w-5 h-5" />
                                    <span>Iniciar Evento</span>
                                </button>
                            </div>
                        )}

                        {eventStatus === 'active' && (
                            <div className="space-y-4">
                                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                        <span className="text-green-200 text-sm">Evento en progreso</span>
                                    </div>

                                    {currentQuestion && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-green-100">
                                                    Pregunta {currentQuestion.position} de {currentQuestion.total}
                                                </span>
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-4 h-4 text-green-300" />
                                                    <span className="text-green-100 font-mono">{formatTime(timeElapsed)}</span>
                                                </div>
                                            </div>
                                            <p className="text-green-100 text-sm bg-green-500/10 p-2 rounded">
                                                {currentQuestion.text}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {!noMoreQuestions ? (
                                        <button
                                            onClick={nextQuestion}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25"
                                        >
                                            <SkipForward className="w-5 h-5" />
                                            <span>Siguiente Pregunta</span>
                                        </button>
                                    ) : (
                                        <div className="text-center text-yellow-200 bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
                                            <p className="mb-2">No hay más preguntas disponibles</p>
                                            <p className="text-sm opacity-75">Puedes finalizar el evento ahora</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={endEvent}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-red-500/25"
                                    >
                                        <Square className="w-5 h-5" />
                                        <span>Finalizar Evento</span>
                                    </button>
                                </div>
                            </div>
                        )}


                        {eventStatus === 'ended' && (
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Evento Finalizado</h3>
                                <p className="text-gray-300">
                                    Los resultados han sido enviados a todos los participantes.
                                </p>
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                    <p className="text-green-200 text-sm">
                                        El evento se completó exitosamente. Puedes cerrar esta ventana.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Panel de Estadísticas */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                            <Users className="w-5 h-5" />
                            <span>Estadísticas en Vivo</span>
                        </h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-500/20 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-300">{connectedParticipants}</div>
                                    <div className="text-blue-200 text-sm">Participantes</div>
                                </div>
                                <div className="bg-purple-500/20 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-300">
                                        {currentQuestion?.position || 0}
                                    </div>
                                    <div className="text-purple-200 text-sm">Pregunta Actual</div>
                                </div>
                            </div>

                            {eventStarted && !eventEnded && currentQuestion && (
                                <div className="bg-gray-500/20 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-200 text-sm">Progreso del evento</span>
                                        <span className="text-gray-200 text-sm">
                                            {Math.round((currentQuestion.position / currentQuestion.total) * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${(currentQuestion.position / currentQuestion.total) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="bg-orange-500/20 rounded-lg p-4">
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-orange-300 mb-1">
                                        {formatTime(timeElapsed)}
                                    </div>
                                    <div className="text-orange-200 text-sm">
                                        {currentQuestion ? 'Tiempo de la pregunta' : 'Tiempo total'}
                                    </div>
                                </div>
                            </div>

                            {eventStatus === 'active' && (
                                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-green-200 text-sm">En vivo</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Panel de Instrucciones */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3">💡 Instrucciones</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-gray-300 text-sm">
                        <ul className="space-y-1">
                            <li>• Verifica que todos los participantes estén conectados</li>
                            <li>• Inicia el evento cuando estés listo</li>
                            <li>• Controla el ritmo con "Siguiente Pregunta"</li>
                        </ul>
                        <ul className="space-y-1">
                            <li>• El tiempo se cuenta automáticamente</li>
                            <li>• Puedes finalizar en cualquier momento</li>
                            <li>• Los resultados se envían automáticamente</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}