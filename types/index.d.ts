export declare function setup<Props extends object>(
  component: (props: React.PropsWithChildren<Props>) => () => React.ReactNode,
): React.NamedExoticComponent<
  Props & {
    // https://stackoverflow.com/questions/58874899/pass-children-prop-to-react-memo-component?r=SearchResults
    children?: React.ReactNode
  }
>
export declare function ref(
  value: any,
): {
  value: any
  isRef: boolean
}
export declare function watch(src: any, cb?: any): void
export declare function computed(
  getter: Function,
): {
  value: any
}
export declare function isRef(target: any): boolean
export declare function reactive<T extends object>(target: T): T
