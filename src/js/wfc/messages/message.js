/**
 * 
    message in json format
    {
        "conversation":{
            "conversationType": 0, 
            "target": "UZUWUWuu", 
            "line": 0, 
        }
        "from": "UZUWUWuu", 
        "content": {
            "type": 1, 
            "searchableContent": "1234", 
            "pushContent": "", 
            "content": "", 
            "binaryContent": "", 
            "localContent": "", 
            "mediaType": 0, 
            "remoteMediaUrl": "", 
            "localMediaPath": "", 
            "mentionedType": 0, 
            "mentionedTargets": [ ]
        }, 
        "messageId": 52, 
        "direction": 1, 
        "status": 5, 
        "messageUid": 75735276990792720, 
        "timestamp": 1550849394256, 
        "to": ""
    }
 */
import Conversation from '../model/conversation'
import * as wfcMessage from '../messageConfig'
import NotificationMessageContent from './notification/notificationMessageContent'
import wfc from '../wfc'
export default class Message {
    conversation = {};
    from = '';
    content = {}; // 实际是payload
    messageContent = {};
    messageId = 0;
    direction = 0;
    status = 0;
    messageUid = 0;
    timestamp = 0;
    to = '';

    static protoMessageToMessage(obj) {
        let msg = Object.assign(new Message(), obj);
        // big integer to number
        msg.messageId = Number(msg.messageId);
        msg.messageUid = Number(msg.messageUid);
        msg.timestamp = Number(msg.timestamp);
        msg.conversation = new Conversation(obj.conversation.conversationType, obj.conversation.target, obj.conversation.line);
        let contentClazz = wfcMessage.getMessageContentClazz(msg.content.type);
        if (contentClazz) {
            let content = new contentClazz();
            try {
                content.decode(msg.content);
                if (content instanceof NotificationMessageContent) {
                    content.fromSelf = msg.from === wfc.getUserId();
                }
            } catch (error) {
                console.log('protoMessageToMessage', error);
            }
            msg.messageContent = content;

        } else {
            console.error('message content not register', obj);
        }

        return msg;
    }
}