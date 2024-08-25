import { Link } from 'react-router-dom'
import { RiLinkedinFill } from "react-icons/ri";
import '../assets/footer.scss'

export default function Footer() {
    return (
        <footer>
            <section className="attachments">
                <div className="navigate">
                    <div className="social_media">
                        <img className="logo" src={'/icons/suplency.png'} alt="Suplency logo"/>
                        <div className="content">   
                            <p>Encontre a Suplency nas redes sociais</p>
                            <ul className="links_social_media">
                                <li className="link">
                                    <a href="#"><RiLinkedinFill/></a>
                                </li>

                                <li className="link"><a href="#">
                                    <img src="https://cdn-icons-png.flaticon.com/512/733/733635.png" alt=""/></a>
                                </li>

                                <li className="link"><a href="#">
                                    <img src="https://cdn-icons-png.flaticon.com/512/733/733635.png" alt=""/></a>
                                </li>

                                <li className="link"><a href="#">
                                    <img src="https://cdn-icons-png.flaticon.com/512/733/733635.png" alt=""/></a>
                                </li>
                            </ul>
                        </div>
                    </div>
        
                    <ul className="suplency_navigate">
                        <li><Link to="#">Sobre nós</Link></li>
                        <li><Link to="#">Tutoriais</Link></li>
                    </ul>
                </div>
        
                <div className="support">
                    <h3 className="poppins support_tittle">Suporte:</h3>
                    <input className="input_box" type="text" placeholder="Precisa de ajuda?... Digite aqui!"/>
                </div>
            </section>
            <hr/>
        </footer>
    )
}