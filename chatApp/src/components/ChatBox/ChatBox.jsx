import './ChatBox.css'
import assets from '../../assets/assets.js'

const ChatBox = () => {
    return (
        <div className="chat-box">
            <div className="chat-user">
                <img src={assets.profile_img} alt="" />
                <p>Martin Stanford <img className='dot' src={assets.green_dot} alt="" /></p>
                <img src={assets.help_icon} className='help' alt="" />
            </div>

            <div className="chat-msg">
                <div className="s-msg">
                    <p className="msg"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi mollitia placeat dicta error temporibus expedita at distinctio nihil! Suscipit consequuntur aliquam excepturi ut ipsa nobis obcaecati sit similique neque consequatur.</p>
                    <div><img src={assets.profile_img} alt="" />
                    <p>2:30 PM</p>
                    </div>
                </div>

                <div className="s-msg">
                    <img className='msg-img' src={assets.pic1} alt="" />
                    <div><img src={assets.profile_img} alt="" />
                    <p>2:30 PM</p>
                    </div>
                </div>

                <div className="r-msg">
                    <p className="msg"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi mollitia placeat dicta error temporibus expedita at distinctio nihil! Suscipit consequuntur aliquam excepturi ut ipsa nobis obcaecati sit similique neque consequatur.</p>
                    <div><img src={assets.profile_img} alt="" />
                    <p>2:30 PM</p>
                    </div>
                </div>
            </div>

            <div className="chat-input">
                <input type="text" className="text" placeholder='Send a message'/>
                <input type="file" id='image' accept='image/png, image/jpeg' hidden/>
                <img src={assets.send_button} alt="" />
            </div>
        </div>
    )
}

export default ChatBox

