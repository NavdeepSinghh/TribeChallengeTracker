import Foundation
import Capacitor
import GoogleSignIn

@objc(GoogleSignInPlugin)
public class GoogleSignInPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "GoogleSignInPlugin"
    public let jsName = "GoogleSignInPlugin"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "signIn", returnType: CAPPluginReturnPromise)
    ]

    @objc func signIn(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard let vc = self.bridge?.viewController else {
                call.reject("No view controller")
                return
            }
            GIDSignIn.sharedInstance.signIn(withPresenting: vc) { result, error in
                if let error = error {
                    call.reject(error.localizedDescription)
                    return
                }
                guard let user = result?.user,
                      let idToken = user.idToken?.tokenString else {
                    call.reject("Missing tokens")
                    return
                }
                call.resolve([
                    "idToken": idToken,
                    "accessToken": user.accessToken.tokenString
                ])
            }
        }
    }
}
