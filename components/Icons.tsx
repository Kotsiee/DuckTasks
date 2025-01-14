// deno-lint-ignore-file no-explicit-any
import { animate } from "https://esm.sh/motion@11.15.0";
import { Component, createRef } from "preact";

export const Icons: Record<string, string[]> = {
  Home: [
    'M3 9L12 2L21 9V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V9Z',
    'M9 21V12H15V21'
  ],
  Search: [
    'M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z',
    'M21 21L16.65 16.65'
  ],
  Settings: [
    'M 12 1 L 22 6 L 22 18 L 12 23 L 2 18 L 2 6 L 12 1 Z M 12 8 A 4 4 0 1 1 12 16 A 4 4 0 1 1 12 8 Z'
  ],
  X: [
    'M 20 20 L 4 4 Z',
    'M 20 4 L 4 20 Z'
  ],
  Tick: [
    'M 2 12 L 10 22 L 22 2'
  ],
  Menu: [
    'M 1 6 L 23 6 Z',
    'M 1 18 L 23 18 Z'
  ],
  UpChevron: [
    'M 2 16 L 12 8 L 22 16'
  ],
  DownChevron: [
    'M 2 8 L 12 16 L 22 8'
  ],
  SortSwitch: [
    'M 2 8 L 8 2 L 8 22',
    'M 16 2 L 16 22 L 22 16'
  ],
  Sort: [
    'M 2 4 L 22 4',
    'M 2 12 L 18 12',
    'M 2 20 L 14 20'
  ],
  Filter: [
    'M 1 1 L 23 1 L 15 10 L 15 18 L 9 22 L 9 10 Z'
  ],
  Save: [
    'M 2 2 L 22 2 L 22 22 L 12 16 L 2 22 Z'
  ]
};

interface AIconProps{
  size?: number
  colour?: string
  startPaths: string[];
  endPaths?: string[];
  onClick?: (state: boolean) => void;
  onHover?: () => void;
  offHover?: () => void;
  initalState?: boolean;
  className?: string
}

interface AIconState extends AIconProps{
}

export default class AIcon extends Component<AIconProps, AIconState>{
  pRefs: (SVGPathElement)[] = [];
  svg = createRef<SVGSVGElement>();
  started: boolean = false
  initPaths: string[] = []

  constructor (props: any){
    super(props);

    this.state = {
      size: props.size || 24,
      colour: props.colour || 'white',
      startPaths: props.startPaths,
      endPaths: props.endPaths,
      ...props
    };
  }

  startClick(){
    if(this.pRefs){
      this.pRefs.forEach((path, index) => {
        animate(path, { d: this.started ? this.state.startPaths[index] : this.state.endPaths![index] }, { duration: 0.2 });
      });
    }

    if (!this.started) this.svg?.current?.classList.add("active")
    else this.svg?.current?.classList.remove("active")
  }

  click(){
    if (this.state.endPaths) this.startClick()
    if (this.state.onClick) this.state.onClick(this.started);
    
    this.started = !this.started;
  }

  override componentDidMount(): void {
    this.started = this.state.initalState ? this.state.initalState : false

    if (this.started) {
      this.svg?.current?.classList.add("active")
      this.pRefs.forEach((path, index) => {
        path.setAttribute('d', `${this.state.endPaths?.[index] ? this.state.endPaths[index]  : this.state.startPaths[index]}`)
      })
    }
    else{
      this.svg?.current?.classList.remove("active")
    }
  }

  onMouseEnter = () => { if (this.state.onHover) this.state.onHover(); };
  onMouseLeave = () => { if (this.state.offHover) this.state.offHover(); };

  render(){
    const { size, colour, startPaths } = this.state;
    
    return(
        <svg
          ref={this.svg}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill-rule="evenodd"
          xmlns="http://www.w3.org/2000/svg"
          stroke={colour}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"

          class={`${this.state.className} icon animatedIcon`}
          onClick={() => this.click()}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          {startPaths!.map((d, index) => {
            return(
              <path
                key={index}
                ref={(el) => el && (this.pRefs[index] = el)}
                d={d}
              />
            )
          })}
        </svg>
    )
  }
}