import UIKit
import Capacitor

class ViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        // Register custom in-app plugins
        bridge?.registerPluginType(GoogleSignInPlugin.self)
    }
}
