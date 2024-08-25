import Header from "../../components/Header"
import Footer from "../../components/Footer"
import {Link} from 'react-router-dom'
import './home.scss'

export default function Home() {
    return (
        <>
            <Header/>
            <main>
                <section className="section_top">
                    <section className="tittle">
                        <h1 className="suplency_gradient_tittle">Suplency</h1>
                        <h2 className="studyplataform_tittle">Study Plataform</h2>
                        <p className="introduction_text">   
                            A plataforma do Estudante feita por um Estudante! Venha desfrutar de todos os benefícios que nossa plataforma oferece para alavancar seus estudos! E lembre-se, tudo de forma gratuita!
                        </p>
                        <div className="tittle_buttons">
                            <Link to='/study/' className="button black_button">
                                <span>Comece Agora!</span>
                            </Link>
                            <Link to='/account/login/' className="button white_button">
                                <span>Login</span>
                            </Link>
                        </div>
                    </section>
                    
                    <section className="draw">
                        <img src={'/img/presentation.png'} alt="study image"/>
                    </section>
                </section>

                <section className="suplency_products">
                    <h1 className="poppins suplency_products_tittle">Na Suplency você conta com:</h1>
                    <div className="grid_products">
                        <div className="product">
                            <img src={'/icons/flashcard.png'} alt="Simbolo de tempo"/>
                            <h1>Cartões de Memória</h1>
                            <p>Contamos com FlaschCards optimizados para ajuda-lo no aprendizado e na fixação de conteúdos!</p>
                        </div>
                        <div className="product">
                            <img src={'/icons/pomodoro.png'} alt="Simbolo de tempo"/>
                            <h1>Método Pomodoro</h1>
                            <p>Nosso site também abrange o Método Pomodoro, que busca mais foco e menos distração à partir da organização de seu tempo!</p>
                        </div>
                        <div className="product">
                            <img src={'/icons/notebook.png'} alt="Simbolo de tempo"/>
                            <h1>Biblioteca Ilimitada</h1>
                            <p>Também está incluído uma biblioteca ilimitada para você armazenar suas anotações, FlashCards e focos!</p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer/>
        </>
    )
}