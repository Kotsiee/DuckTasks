import AIcon from "../../components/Icons.tsx";
import { Icons } from "../../components/Icons.tsx";

export default function ProfilePage() {
  return (
    <div class="profileLayout">
      <section class="banner">
        <img
          class="banner-img"
          src="https://letsenhance.io/static/a31ab775f44858f1d1b80ee51738f4f3/11499/EnhanceAfter.jpg"
        />
        <img
          class="profile-img"
          src="https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg"
        />
      </section>
      <section class="user-info">
        <div class="user-info-container">

          <div class="contents">
            <div class="details">
              <h3>Ahmed Kotwal</h3>
              <p>@ahmedk</p>
              <p>
                Software Developer | C#, Unity, C++, Unreal | Tech Enthusiast
              </p>
            </div>

            <div class="actions">
              <button class="connect">Connect</button>
              <button class="message">Message</button>
            </div>
          </div>

          <div class="additional-actions">
            <div class="additional-actions-container">
              <AIcon startPaths={Icons.DotMenu}/>
            </div>
          </div>

        </div>
      </section>

      <section class="about">
        <h5>About</h5>
        <h5>Languages</h5>
        <h5>Skills</h5>
      </section>

      <section class="activity">
        <div class="select">
            <ul class="select-tab">
                <li>
                    <input type="radio" name="activity-select" id="posts" hidden checked/>
                    <label for="posts">Activity</label>
                </li>

                <li>
                    <input type="radio" name="activity-select" id="projects" hidden/>
                    <label for="projects">Projects</label>
                </li>

                <li>
                    <input type="radio" name="activity-select" id="experience" hidden/>
                    <label for="experience">Experience</label>
                </li>

                <li>
                    <input type="radio" name="activity-select" id="teams" hidden/>
                    <label for="teams">Teams</label>
                </li>
            </ul>

            <div class="filter">
                <AIcon startPaths={Icons.Search} size={20} className="search-icon"/>
                <AIcon startPaths={Icons.Filter} size={20} className="filter-icon"/>
            </div>
        </div>
      
        <div class="content">

        </div>
      </section>
    </div>
  );
}
