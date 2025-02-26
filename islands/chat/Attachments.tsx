export default function Attachments() {
    return (
        <div class="attachments">
            <div class="actions actions-container">
                <div class="actions">
                    <button class="new">New +</button>
                    <button>Select</button> {/**Select, Deselect, Select All */}

                    <div class="actions">
                        <button>Select All</button>
                        <button>Download</button>
                        <button>Share</button>
                    </div>
                </div>

                <div class="actions">
                    <button>Report</button>
                    <button>Delete</button>
                </div>
            </div>

            <div class="items">
                <div class="items-container">

                    <div class="attachment-card">
                        <div class="attachment-image">
                            <img src="https://blog.adobe.com/en/publish/2024/10/14/media_1ca79b205381242c5f8beaaee2f0e1cfb2aa8f324.png?width=750&format=png&optimize=medium"/>
                        </div>

                        <div class="attachment-details">
                            <p class="title">Title</p>
                            <p class="date">Date</p>
                        </div>
                    </div>

                </div>
            </div>

            <div class="preview">
                <div class="preview-image">
                    <img src="https://blog.adobe.com/en/publish/2024/10/14/media_1ca79b205381242c5f8beaaee2f0e1cfb2aa8f324.png?width=750&format=png&optimize=medium"/>
                </div>

                <div>
                    <div>
                        <p>Title</p>
                        <p>PNG Image</p>
                        <p>Date Time</p>
                    </div>

                    <div>
                        <p>Go to message</p>
                        <p>message</p>
                    </div>
                </div>

                <div>
                    <button>Open</button>
                    <button>Download</button>
                    <button>Copy Link</button>
                    <button>Share</button>
                </div>
            </div>
        </div>
    )
}