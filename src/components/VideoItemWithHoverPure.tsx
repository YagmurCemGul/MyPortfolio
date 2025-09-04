
//src/components/VideoItemWithHoverPure.tsx
"use client";

import { PureComponent, ForwardedRef, forwardRef } from "react";

type VideoItemWithHoverPureType = {
    src: string;
    innerRef: ForwardedRef<HTMLDivElement>;
    handleHover: (value: boolean) => void;
    onClick: () => void;                // 👈 eklendi
};

class VideoItemWithHoverPure extends PureComponent<VideoItemWithHoverPureType> {
    render() {
        return (
            <div
                ref={this.props.innerRef}
                onClick={this.props.onClick}    // 👈 eklendi
                style={{
                    zIndex: 9,
                    cursor: "pointer",
                    borderRadius: 6,
                    width: "100%",
                    position: "relative",
                    // Sabit 16:9 oran – modern tarayıcılar için:
                    aspectRatio: "16 / 9",
                    // Fallback (aspect-ratio olmayanlarda):
                    paddingTop: "56.25%",
                    overflow: "hidden",
                }}
            >
                <img
                    src={this.props.src}
                    alt=""
                    loading="lazy"
                    style={{
                        
                        height: "100%",
                        objectFit: "cover",
                        position: "absolute",
                        inset: 0,              // top/right/bottom/left = 0
                        width: "100%",
                        display: "block",      // olası satır yüksekliğini temizler
                        
                    }}
                    onPointerEnter={() => this.props.handleHover(true)}
                    onPointerLeave={() => this.props.handleHover(false)}
                />
            </div>
        );
    }
}

const VideoItemWithHoverRef = forwardRef<
    HTMLDivElement,
    Omit<VideoItemWithHoverPureType, "innerRef">
>((props, ref) => <VideoItemWithHoverPure {...props} innerRef={ref} />);
VideoItemWithHoverRef.displayName = "VideoItemWithHoverRef";

export default VideoItemWithHoverRef;
