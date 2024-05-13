export {debounce, throttle} from "@natsume_shiki/mika-ui";

// type Func = (...args: any) => any;
//
// export const throttle = (fn: Func, delay: number) => {
//     let last = 0;
//     return function (...args: any) {
//         const now = Date.now();
//         if (now - last > delay) {
//             last = now;
//             fn(...args);
//         }
//     }
// };
