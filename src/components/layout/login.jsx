import CssImage from "../../assets/CSS-Home.png";
import DSSImage from "../../assets/DSS-Home.png";
import LogoImage from "../../assets/logocol.jpg";
import { version } from "../../utils";

export default function LayoutLogin(props) {
    return (
        <div>
            <div className="bg-white pt-4 h-screen flex flex-col">
                <span className="absolute ml-2">{version}</span>
                <section>
                    <header className="flex justify-evenly items-center flex-wrap">
                        <div>
                            <img
                                src="https://cpcesfe1.org.ar/wp-content/uploads/2023/03/logo_mails.png"
                                alt="logo-consejo"
                                width={272}
                                height={90}
                            />
                        </div>
                        <div className="flex justify-between">
                            <img src={DSSImage} alt="logo-DSS" width={135} height={90} />
                            <img src={CssImage} alt="logo-CSS" width={182} height={90} />
                            <img src={LogoImage} alt="logo-COL" width={90} height={90} />
                        </div>
                    </header>
                </section>
                <div className="h-full w-full flex justify-center my-2">
                    {props.children}
                </div>
                <section className="bg-black text-white mt-auto">
                    <footer className="text-white flex justify-center">
                        <div className="flex justify-center items-center py-2">
                            <div>
                                <h3 className="text-sm">Consejo de Ciencias Económicas de Santa Fe - Cámara I</h3>
                            </div>
                        </div>
                    </footer>
                </section>
            </div>
        </div>
    );
}
