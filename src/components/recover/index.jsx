import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MD5 } from "crypto-js";
import LayoutLogin from "../layout/login";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { checkLoginService, loginRequest } from "../../service/sesion";

export default function Recover() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLoginClick = async () => {
    try {
      const res = await loginRequest(username || "", password || "");
      if (res.Errorid === "0") {
        localStorage.setItem("user", res.Usuario || "");
        localStorage.setItem("sesion", res.Sesion || "");
        localStorage.setItem("type", res.Tipo || "");
        localStorage.setItem("number", res.Numero || "");
        localStorage.setItem("img", res.Foto || "");
        localStorage.setItem("status", res.Estado || "");
        const permissions = {
          Css: res.Css,
          Cra: res.Cra,
          Dss: res.Dss,
          Cont: res.Cont,
          Interno: res.Interno,
        };
        const permissionsString = JSON.stringify(permissions);

        // Hashear la cadena de permisos usando MD5
        const hashedPermissions = MD5(permissionsString).toString();

        // Guardar el hash en localStorage
        localStorage.setItem("mp", hashedPermissions);
        console.log(
          "Permisos hasheados guardados en localStorage:",
          hashedPermissions,
        );
        // toast({
        //   duration: 5000,
        //   title: `Inicio de sesión correcto`,
        //   description: `Bienvenid@ ${res.Denominacion}!`,
        // });
        navigate("/T-IN");
      } else {
        // toast({
        //   title: "Error iniciando sesión",
        //   description: `Error: ${res.Errornombre || "Contraseña incorrecta"}`,
        // });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleLoginClick();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await checkLoginService();
        if (res.Errorid !== "0") {
          //   toast({
          //     duration: 5000,
          //     title: `Sesión caducada`,
          //     description: `Inicie sesión nuevamente`,
          //   });
        } else {
          //   toast({
          //     duration: 5000,
          //     title: `Inicio de sesión correcto`,
          //     description: `Bienvenid@ de nuevo!`,
          //   });
          navigate("/agenda-comunicacion");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <LayoutLogin>
      <main className="my-20 w-full">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Ingrese sus datos
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onKeyDown={handleKeyDown}>
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Usuario
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Usuario"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <label
                htmlFor="text"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Contraseña
              </label>

              <div className="relative my-2 flex">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                  className="block w-full rounded-md rounded-r-none border-0 py-1.5 pl-2 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                />
                <button
                  className="w-fit cursor-pointer rounded-l-none focus:outline-none"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              <div>
                <button
                  onClick={() => navigate("/reset")}
                  className="w-full pt-4 text-sm font-semibold"
                >
                  ¿olvidó su contraseña?
                </button>
              </div>
            </div>
            <div>
              <button
                onClick={handleLoginClick}
                className="flex w-full justify-center rounded-md bg-[#336699] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#336699]/70"
              >
                Iniciar sesión
              </button>
            </div>
          </form>
        </div>
      </main>
    </LayoutLogin>
  );
}
