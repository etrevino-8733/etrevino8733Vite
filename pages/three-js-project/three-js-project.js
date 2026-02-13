import { techStack } from "/utils/techStack.module";
import { welcomeMessage } from "/utils/welcomeMessage.module";
import * as TopNav from "/utils/TopNav/topNav.module";
import * as TopNavStyle from "/utils/TopNav/topNavStyle.module";

window.onload = async () => {
    welcomeMessage();
    var scene = new techStack();
    scene._Init();
    await scene.triggerTechStack();
}
