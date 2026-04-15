import { getLGAsByState, getStates } from '@some19ice/nigeria-geo-core';
import { LGAMap, NigeriaMap } from '@some19ice/nigeria-geo-viz/react';


const Test = () => {
    // console.log('NigeriaMap', NigeriaMap);
    // const states = getStates();
    // console.log(states);
    // // Get all LGAs in Lagos
    // const lagosLGAs = getLGAsByState('ondo');
    // console.log(lagosLGAs);
    return (
        <>
            {/* <NigeriaMap
                width={800}
                height={600}
                onStateClick={(stateId) => console.log('Clicked:', stateId)}
                choroplethData={{
                    lagos: 100,
                    kano: 80,
                    rivers: 60,
                    ondo: 120,
                }}
            /> */}

            {/* <div className="map-container">
                <LGAMap
                    stateId="niger"
                    width={800}
                    height={600}
                    enableHover
                    enableSelection
                    onLGAClick={(lgaId) => console.log('Clicked:', lgaId)}
                // choroplethData={{
                //     akure_south: 100,
                //     akure_north: 80,
                // }}
                />
            </div> */}

            <LGAMap
                width={800}
                height={600}
                // stateId='ondo'
                // enableHover
                // enableSelection
                onLGAClick={(lgaId) => console.log('Clicked:', lgaId)}
            // choroplethData={{
            //     owo: 100,
            //     'akoko-south-west': 80,
            //     'akoko-south-east': 60,
            //     'akoko-north-east': 40,
            //     'akoko-north-west': 20,
            // }}

            />
        </>
    );
}

export default Test;