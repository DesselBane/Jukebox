using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Castle.DynamicProxy;

namespace Jukebox.Common.Abstractions.Interception
{
    public abstract class InterceptingMappingBase : IInterceptor
    {
        #region Vars

        private IReadOnlyDictionary<string, Action<IInvocation>> _mappings;

        #endregion

        #region Implementation of IInterceptor

        public virtual void Intercept(IInvocation invocation)
        {
            if (_mappings.ContainsKey(invocation.Method.Name))
                _mappings[invocation.Method.Name](invocation);

            invocation.Proceed();
        }

        #endregion


        protected void BuildUp(IDictionary<string, Action<IInvocation>> mappings)
        {
            if (_mappings != null)
                throw new InvalidOperationException($"{nameof(BuildUp)} Method can only be called once");

            _mappings = new ReadOnlyDictionary<string, Action<IInvocation>>(mappings);
        }
    }
}