import LayoutLogin from "../layout/login"

export const NotFound = () => {
    return (
        <LayoutLogin>
            <div className="text-center w-full my-auto">
                <h1 className="text-3xl font-bold text-red-600">404</h1>
                <h2 className="font-semibold">No existe la página</h2>
            </div>
        </LayoutLogin>
    )
}